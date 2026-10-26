import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { SENHA_DE_TESTE } from '../../mocks/dados/usuario'
import { servidor } from '../../mocks/servidor'
import { lerToken } from '../../shared/api/sessao'
import { abrirApp } from '../../test/abrirApp'
import { jaEntrou } from '../../test/sessao'
import { telaDeComputador } from '../../test/tela'

afterEach(() => {
  servidor.events.removeAllListeners()
})

function guardarPedidos(metodo: string, caminho: string) {
  const corpos: unknown[] = []
  servidor.events.on('request:start', async ({ request }) => {
    if (request.method !== metodo || !request.url.endsWith(caminho)) return
    corpos.push(await request.clone().json())
  })
  return corpos
}

async function abrirConta() {
  jaEntrou()
  const roteador = abrirApp('/conta')
  await screen.findByLabelText('Nome')
  return roteador
}

describe('Minha conta', () => {
  it('mostra os dados, com o e-mail só para ler e o WhatsApp no jeito brasileiro', async () => {
    await abrirConta()

    expect(screen.getByLabelText('Nome')).toHaveValue('João')
    expect(screen.getByLabelText('E-mail')).toHaveValue('joao@exemplo.com')
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('readonly')
    expect(screen.getByLabelText('WhatsApp')).toHaveValue('(34) 99999-9999')
    expect(screen.getByRole('switch', { name: 'Receber avisos automáticos' })).toBeChecked()
  })

  it('salva só o que mudou e avisa', async () => {
    const corpos = guardarPedidos('PATCH', '/api/usuario/me')
    await abrirConta()

    await userEvent.clear(screen.getByLabelText('Nome'))
    await userEvent.type(screen.getByLabelText('Nome'), 'João Silva')
    await userEvent.click(screen.getByRole('switch', { name: 'Receber avisos automáticos' }))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Alterações salvas')).toBeInTheDocument()
    expect(corpos).toEqual([{ nome: 'João Silva', avisosWhatsapp: false }])
    expect(screen.getByRole('switch', { name: 'Receber avisos automáticos' })).not.toBeChecked()
  })

  it('apagar o WhatsApp manda null, que desvincula', async () => {
    const corpos = guardarPedidos('PATCH', '/api/usuario/me')
    await abrirConta()

    await userEvent.clear(screen.getByLabelText('WhatsApp'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    await screen.findByText('Alterações salvas')
    expect(corpos).toEqual([{ whatsappNumero: null }])
  })

  it('sem mudança, não chama a API', async () => {
    const corpos = guardarPedidos('PATCH', '/api/usuario/me')
    await abrirConta()

    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(corpos).toEqual([])
  })

  it('o WhatsApp de outra conta avisa embaixo do campo', async () => {
    await abrirConta()

    await userEvent.clear(screen.getByLabelText('WhatsApp'))
    await userEvent.type(screen.getByLabelText('WhatsApp'), '(34) 90000-0000')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(await screen.findByText('Este WhatsApp já está em outra conta.')).toBeInTheDocument()
    expect(screen.getByLabelText('WhatsApp')).toBeInvalid()
  })

  it('"Trocar minha senha" manda o link para o e-mail da conta', async () => {
    const corpos = guardarPedidos('POST', '/api/auth/esqueci-senha')
    await abrirConta()

    await userEvent.click(screen.getByRole('button', { name: 'Trocar minha senha' }))

    expect(await screen.findByText(/Mandamos um link para/)).toHaveTextContent(
      'Mandamos um link para joao@exemplo.com. Ele vale por 30 minutos.',
    )
    expect(corpos).toEqual([{ email: 'joao@exemplo.com' }])
  })

  it('"Sair" apaga o token e volta para o login', async () => {
    const roteador = await abrirConta()

    await userEvent.click(screen.getByRole('button', { name: 'Sair' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/entrar')
    expect(lerToken()).toBeNull()
  })

  it('excluir a conta pede a senha; a senha errada avisa sem deslogar', async () => {
    await abrirConta()

    await userEvent.click(screen.getByRole('button', { name: 'Excluir minha conta' }))
    const confirmacao = screen.getByRole('dialog', { name: 'Excluir sua conta?' })
    await userEvent.click(within(confirmacao).getByRole('button', { name: 'Excluir minha conta' }))
    expect(
      within(confirmacao).getByLabelText('Digite sua senha para confirmar'),
    ).toHaveAccessibleDescription('Digite sua senha.')

    await userEvent.type(
      within(confirmacao).getByLabelText('Digite sua senha para confirmar'),
      'errada',
    )
    await userEvent.click(within(confirmacao).getByRole('button', { name: 'Excluir minha conta' }))

    expect(await within(confirmacao).findByText('Senha incorreta.')).toBeInTheDocument()
    expect(lerToken()).toBe('token-de-teste')
  })

  it('com a senha certa, exclui e volta para o login com o aviso', async () => {
    const roteador = await abrirConta()

    await userEvent.click(screen.getByRole('button', { name: 'Excluir minha conta' }))
    const confirmacao = screen.getByRole('dialog', { name: 'Excluir sua conta?' })
    await userEvent.type(
      within(confirmacao).getByLabelText('Digite sua senha para confirmar'),
      SENHA_DE_TESTE,
    )
    await userEvent.click(within(confirmacao).getByRole('button', { name: 'Excluir minha conta' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/entrar')
    expect(screen.getByRole('status')).toHaveTextContent('Sua conta foi excluída.')
    expect(lerToken()).toBeNull()
  })

  it('abre numa janela por cima do painel, e o X fecha e volta para o painel', async () => {
    const roteador = await abrirConta()

    const janela = screen.getByRole('dialog', { name: 'Minha conta' })
    expect(within(janela).getByLabelText('Nome')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Suas lavouras' })).toBeInTheDocument()

    await userEvent.click(within(janela).getByRole('button', { name: 'Fechar' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Minha conta' })).not.toBeInTheDocument(),
    )
    expect(roteador.state.location.pathname).toBe('/')
  })

  it('no computador, o link "Minha conta" do topo fica marcado', async () => {
    telaDeComputador()
    await abrirConta()

    expect(screen.getByRole('button', { name: 'Sair' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Excluir minha conta' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Minha conta' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
