import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { servidor } from '../../mocks/servidor'
import { abrirApp } from '../../test/abrirApp'
import { jaEntrou } from '../../test/sessao'
import { telaDeComputador } from '../../test/tela'

afterEach(() => {
  servidor.events.removeAllListeners()
})

function guardarPedidos(metodo: string) {
  const corpos: unknown[] = []
  servidor.events.on('request:start', async ({ request }) => {
    if (request.method !== metodo) return
    corpos.push(request.body ? await request.clone().json() : null)
  })
  return corpos
}

async function abrirEdicao() {
  jaEntrou()
  const roteador = abrirApp('/lavouras/1/editar')
  await screen.findByRole('heading', { level: 1, name: 'Editar lavoura' })
  return roteador
}

describe('Editar lavoura', () => {
  it('abre com os campos preenchidos', async () => {
    await abrirEdicao()

    expect(screen.getByText('Uberaba – MG')).toBeInTheDocument()
    expect(await screen.findByRole('radio', { name: 'Soja' })).toBeChecked()
    expect(screen.getByLabelText('Nome para esta lavoura')).toHaveValue('Talhão do fundo')
    expect(screen.getByLabelText('Quando plantou?')).toHaveValue('2026-08-27')
    expect(screen.getByLabelText('Tamanho em hectares (opcional)')).toHaveValue('12')
  })

  it('salva só o que mudou e volta para a lavoura com "Alterações salvas"', async () => {
    const corpos = guardarPedidos('PATCH')
    const roteador = await abrirEdicao()

    await userEvent.click(await screen.findByRole('radio', { name: 'Milho' }))
    await userEvent.clear(screen.getByLabelText('Tamanho em hectares (opcional)'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Talhão do fundo' }),
    ).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/lavouras/1')
    expect(corpos).toEqual([{ culturaId: 2, areaHa: null }])
    expect(screen.getByRole('status', { name: '' })).toHaveTextContent('Alterações salvas')
  })

  it('sem nenhuma mudança, volta sem chamar a API', async () => {
    const corpos = guardarPedidos('PATCH')
    const roteador = await abrirEdicao()

    await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    await screen.findByRole('heading', { level: 1, name: 'Talhão do fundo' })
    expect(roteador.state.location.pathname).toBe('/lavouras/1')
    expect(corpos).toEqual([])
  })

  it('o nome de outra lavoura avisa embaixo do nome', async () => {
    await abrirEdicao()

    await userEvent.clear(screen.getByLabelText('Nome para esta lavoura'))
    await userEvent.type(screen.getByLabelText('Nome para esta lavoura'), 'Roça da baixada')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByText('Você já tem uma lavoura com esse nome.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome para esta lavoura')).toBeInvalid()
  })

  it('valida como na Nova lavoura', async () => {
    const corpos = guardarPedidos('PATCH')
    await abrirEdicao()

    await userEvent.clear(screen.getByLabelText('Nome para esta lavoura'))
    await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(screen.getByLabelText('Nome para esta lavoura')).toHaveAccessibleDescription(
      /Dê um nome para a lavoura./,
    )
    expect(corpos).toEqual([])
  })

  it('mostra o mapa e o formulário juntos, sem o "Trocar"', async () => {
    const corpos = guardarPedidos('PATCH')
    await abrirEdicao()

    expect(screen.getByText('Mapa desligado')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Trocar o local no mapa' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    await screen.findByRole('heading', { level: 1, name: 'Talhão do fundo' })
    expect(corpos).toEqual([])
  })

  it('excluir pede confirmação, apaga e volta para o painel', async () => {
    const pedidos = guardarPedidos('DELETE')
    const roteador = await abrirEdicao()

    await userEvent.click(screen.getByRole('button', { name: 'Excluir esta lavoura' }))
    const confirmacao = screen.getByRole('dialog', { name: 'Excluir o Talhão do fundo?' })
    expect(confirmacao).toHaveTextContent('Isso não tem volta.')
    await userEvent.click(within(confirmacao).getByRole('button', { name: 'Sim, excluir lavoura' }))

    expect(await screen.findByRole('heading', { level: 1, name: /, João$/ })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/')
    expect(pedidos).toHaveLength(1)
    expect(screen.getByRole('status', { name: '' })).toHaveTextContent('Lavoura excluída')
  })

  it('cancelar a exclusão não apaga nada', async () => {
    const pedidos = guardarPedidos('DELETE')
    await abrirEdicao()

    await userEvent.click(screen.getByRole('button', { name: 'Excluir esta lavoura' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(pedidos).toEqual([])
  })

  it('uma lavoura que não existe mostra que não foi encontrada', async () => {
    jaEntrou()
    abrirApp('/lavouras/99/editar')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Lavoura não encontrada' }),
    ).toBeInTheDocument()
  })

  it('no computador, como o painel: o mapa, o formulário e a barra do topo', async () => {
    telaDeComputador()
    await abrirEdicao()

    expect(screen.getByText('Mapa desligado')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Trocar o local no mapa' })).not.toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument()
  })
})
