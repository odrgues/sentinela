import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { EMAIL_DE_TESTE } from '../../mocks/dados/usuario'
import { servidor } from '../../mocks/servidor'
import { lerToken } from '../../shared/api/sessao'
import { abrirApp } from '../../test/abrirApp'

type Dados = { nome?: string; email?: string; senha?: string; whatsapp?: string }

async function preencher({ nome, email, senha, whatsapp }: Dados) {
  await screen.findByRole('heading', { level: 1, name: 'Criar conta' })
  if (nome) await userEvent.type(screen.getByLabelText('Seu nome'), nome)
  if (email) await userEvent.type(screen.getByLabelText('E-mail'), email)
  if (senha) await userEvent.type(screen.getByLabelText('Senha'), senha)
  if (whatsapp) await userEvent.type(screen.getByLabelText('WhatsApp (opcional)'), whatsapp)
  await userEvent.click(screen.getByRole('button', { name: 'Criar conta' }))
}

describe('Cadastro', () => {
  it('cria a conta, já entra e vai marcar a primeira lavoura', async () => {
    const roteador = abrirApp('/cadastro')

    await preencher({ nome: 'Maria', email: 'maria@exemplo.com', senha: 'segredo' })

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Onde fica sua lavoura?' }),
    ).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/lavouras/nova')
    expect(lerToken()).toBe('token-de-mentira')
  })

  it('manda o WhatsApp só quando a pessoa preenche', async () => {
    const corpos: unknown[] = []
    servidor.events.on('request:start', async ({ request }) => {
      if (request.method === 'POST') corpos.push(await request.clone().json())
    })
    abrirApp('/cadastro')

    await preencher({ nome: 'Maria', email: 'maria@exemplo.com', senha: 'segredo' })
    await screen.findByRole('heading', { level: 1, name: 'Onde fica sua lavoura?' })

    expect(corpos[0]).toEqual({ nome: 'Maria', email: 'maria@exemplo.com', senha: 'segredo' })
    servidor.events.removeAllListeners()
  })

  it('com o e-mail já cadastrado, mostra a mensagem da API', async () => {
    abrirApp('/cadastro')

    await preencher({ nome: 'João', email: EMAIL_DE_TESTE, senha: 'segredo' })

    expect(await screen.findByRole('alert')).toHaveTextContent('Este e-mail já tem uma conta.')
    expect(lerToken()).toBeNull()
  })

  it('com senha curta, avisa embaixo do campo sem chamar a API', async () => {
    abrirApp('/cadastro')

    await preencher({ nome: 'Maria', email: 'maria@exemplo.com', senha: '123' })

    expect(screen.getByLabelText('Senha')).toHaveAccessibleDescription(
      'A senha precisa ter pelo menos 6 caracteres. Pelo menos 6 caracteres.',
    )
  })

  it('mostra embaixo de cada campo os erros que a API apontou', async () => {
    servidor.use(
      http.post('/api/usuario', () =>
        HttpResponse.json(
          {
            status: 400,
            mensagem: 'Confira os campos destacados.',
            campos: { email: 'Insira um e-mail válido' },
          },
          { status: 400 },
        ),
      ),
    )
    abrirApp('/cadastro')

    await preencher({ nome: 'Maria', email: 'maria@', senha: 'segredo' })

    expect(await screen.findByText('Insira um e-mail válido')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInvalid()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
