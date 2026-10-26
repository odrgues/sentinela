import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { APELIDO_REPETIDO } from '../../mocks/lavoura'
import { servidor } from '../../mocks/servidor'
import { abrirApp } from '../../test/abrirApp'
import { jaEntrou } from '../../test/sessao'
import { telaDeComputador } from '../../test/tela'

afterEach(() => {
  servidor.events.removeAllListeners()
})

function guardarCorpoDoPost() {
  const corpos: unknown[] = []
  servidor.events.on('request:start', async ({ request }) => {
    if (request.method === 'POST') corpos.push(await request.clone().json())
  })
  return corpos
}

async function abrirFormulario() {
  await screen.findByRole('heading', { level: 1, name: 'Nova lavoura' })
}

async function preencher({ cultura = 'Soja', apelido = 'Roça nova', data = '2026-08-27' } = {}) {
  await userEvent.click(await screen.findByRole('radio', { name: cultura }))
  if (apelido) await userEvent.type(screen.getByLabelText('Nome para esta lavoura'), apelido)
  if (data) await userEvent.type(screen.getByLabelText('Quando plantou?'), data)
}

describe('Nova lavoura no celular', () => {
  it('mostra o mapa e o formulário na mesma tela, sem passos', async () => {
    jaEntrou()
    abrirApp('/lavouras/nova')

    expect(await screen.findByText('Mapa desligado')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Nova lavoura' })).toBeInTheDocument()
    expect(await screen.findByText('Uberaba – MG')).toBeInTheDocument()
    expect(screen.queryByText('Passo 1 de 2')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Confirmar local' })).not.toBeInTheDocument()
  })

  it('salva com o ponto, o município e o que a pessoa preencheu, e volta para o painel', async () => {
    jaEntrou()
    const corpos = guardarCorpoDoPost()
    const roteador = abrirApp('/lavouras/nova')

    await abrirFormulario()
    expect(screen.getByText('Uberaba – MG')).toBeInTheDocument()
    await preencher()
    await userEvent.type(screen.getByLabelText('Tamanho em hectares (opcional)'), '12,5')
    await userEvent.click(screen.getByRole('button', { name: 'Salvar e ver minha lavoura' }))

    expect(await screen.findByRole('heading', { level: 1, name: /, João$/ })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/')
    expect(screen.getByRole('status', { name: '' })).toHaveTextContent('Lavoura salva!')
    expect(corpos[0]).toEqual({
      culturaId: 3,
      apelido: 'Roça nova',
      dataPlantio: '2026-08-27',
      areaHa: 12.5,
      latitude: -19.747812,
      longitude: -47.931804,
      cidade: 'Uberaba',
      uf: 'MG',
    })
  })

  it('sem preencher, avisa embaixo de cada campo e não chama a API', async () => {
    jaEntrou()
    const corpos = guardarCorpoDoPost()
    abrirApp('/lavouras/nova')
    await abrirFormulario()

    await userEvent.click(screen.getByRole('button', { name: 'Salvar e ver minha lavoura' }))

    expect(screen.getByRole('group', { name: 'Cultura' })).toHaveAccessibleDescription(
      'Escolha o que você plantou.',
    )
    expect(screen.getByLabelText('Nome para esta lavoura')).toBeInvalid()
    expect(screen.getByLabelText('Quando plantou?')).toBeInvalid()
    expect(corpos).toEqual([])
  })

  it('com o nome repetido, avisa embaixo do nome', async () => {
    jaEntrou()
    abrirApp('/lavouras/nova')
    await abrirFormulario()

    await preencher({ apelido: APELIDO_REPETIDO })
    await userEvent.click(screen.getByRole('button', { name: 'Salvar e ver minha lavoura' }))

    expect(await screen.findByText('Você já tem uma lavoura com esse nome.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome para esta lavoura')).toBeInvalid()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('no café, pergunta desde quando a lavoura existe', async () => {
    jaEntrou()
    abrirApp('/lavouras/nova')
    await abrirFormulario()

    await userEvent.click(await screen.findByRole('radio', { name: 'Café' }))

    expect(screen.getByLabelText('Desde quando a lavoura existe?')).toHaveAccessibleDescription(
      'Se a lavoura já produz, pode ser uma data aproximada.',
    )
  })

  it('procura a cultura sem ligar para acento', async () => {
    jaEntrou()
    abrirApp('/lavouras/nova')
    await abrirFormulario()

    await userEvent.type(await screen.findByLabelText('Procurar cultura'), 'algodao')

    const lista = screen.getByRole('group', { name: 'Cultura' })
    expect(within(lista).getAllByRole('radio')).toHaveLength(1)
    expect(within(lista).getByRole('radio', { name: 'Algodão' })).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Procurar cultura'))
    await userEvent.type(screen.getByLabelText('Procurar cultura'), 'uva')
    expect(within(lista).getByText('Nenhuma cultura com esse nome.')).toBeInTheDocument()
  })

  it('mostra a descrição do ciclo de cada cultura', async () => {
    jaEntrou()
    abrirApp('/lavouras/nova')
    await abrirFormulario()

    expect(await screen.findByRole('radio', { name: 'Soja' })).toHaveAccessibleDescription(
      'Ciclo de 120 dias',
    )
    expect(screen.getByRole('radio', { name: 'Café' })).toHaveAccessibleDescription(
      'Perene · colheita de maio a agosto',
    )
    expect(screen.getByRole('radio', { name: 'Cana-de-açúcar' })).toHaveAccessibleDescription(
      'Ciclo de 12 ou 18 meses',
    )
  })
})

describe('Nova lavoura no computador', () => {
  it('mostra o mapa e o formulário juntos, com a barra do topo', async () => {
    telaDeComputador()
    jaEntrou()
    abrirApp('/lavouras/nova')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Nova lavoura' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Mapa desligado')).toBeInTheDocument()
    expect(screen.getByText('Uberaba – MG')).toBeInTheDocument()
    expect(screen.queryByText('Passo 1 de 2')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nova lavoura' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('salva direto, sem os passos', async () => {
    telaDeComputador()
    jaEntrou()
    abrirApp('/lavouras/nova')

    await preencher()
    await userEvent.click(screen.getByRole('button', { name: 'Salvar e ver minha lavoura' }))

    expect(await screen.findByRole('heading', { level: 1, name: /, João$/ })).toBeInTheDocument()
  })

  it('sem conexão, mostra a caixa de erro', async () => {
    telaDeComputador()
    jaEntrou()
    servidor.use(http.post('/api/cultivos', () => HttpResponse.error()))
    abrirApp('/lavouras/nova')

    await preencher()
    await userEvent.click(screen.getByRole('button', { name: 'Salvar e ver minha lavoura' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Sem conexão com o servidor')
  })
})
