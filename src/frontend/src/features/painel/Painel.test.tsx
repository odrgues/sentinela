import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { painel } from '../../mocks/dados/painel'
import { servidor } from '../../mocks/servidor'
import { MENSAGENS } from '../../shared/api/erros'
import { abrirApp } from '../../test/abrirApp'
import { jaEntrou } from '../../test/sessao'
import { telaDeComputador } from '../../test/tela'

function responderPainel(resposta: object) {
  servidor.use(http.get('/api/painel', () => HttpResponse.json({ ...painel(), ...resposta })))
}

describe('Painel', () => {
  it('cumprimenta pelo nome e mostra o clima e a frase da semana', async () => {
    jaEntrou()
    abrirApp('/')

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: /^(Bom dia|Boa tarde|Boa noite), João$/,
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('29°')).toBeInTheDocument()
    expect(screen.getByText('Hoje em Uberaba · sol com poucas nuvens')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Semana quente e com pouca chuva. Na quinta, o calor passa do limite da soja.',
      ),
    ).toBeInTheDocument()
  })

  it('lista as lavouras na ordem da API, com o andamento e o aviso, e cada uma abre o detalhe', async () => {
    jaEntrou()
    const roteador = abrirApp('/')

    const lista = await screen.findByRole('list')
    const lavouras = within(lista).getAllByRole('link')
    expect(lavouras.map((link) => link.textContent)).toEqual([
      'Talhão do fundoSoja · dia 45 de 120 · Desenvolvimento vegetativoCalor forte na quinta',
      'Roça da baixadaMilho · dia 20 de 120 · Vegetativo (V4 a V17)Pouca chuva na semana',
      'Feijão da hortaFeijão · dia 12 de 90 · Germinação e emergência (V0-V2)Tudo certo esta semana',
    ])

    await userEvent.click(lavouras[0])
    expect(roteador.state.location.pathname).toBe('/lavouras/1')
  })

  it('na lavoura perene, mostra a safra no lugar do dia', async () => {
    jaEntrou()
    const [primeira] = painel().cultivos
    responderPainel({
      cultivos: [
        {
          ...primeira,
          cultura: 'Café',
          tipoCiclo: 'perene',
          diaAtual: null,
          cicloDias: null,
          safra: '2026/27',
          fase: null,
        },
      ],
    })
    abrirApp('/')

    expect(await screen.findByText('Café · safra 2026/27')).toBeInTheDocument()
  })

  it('enquanto carrega, mostra o cinza no lugar das lavouras', async () => {
    jaEntrou()
    abrirApp('/')

    expect(screen.getByRole('status', { name: 'Carregando suas lavouras' })).toBeInTheDocument()
    await screen.findByRole('list')
    expect(
      screen.queryByRole('status', { name: 'Carregando suas lavouras' }),
    ).not.toBeInTheDocument()
  })

  it('com a previsão fora do ar, avisa e mostra os avisos de quando deu certo', async () => {
    jaEntrou()
    responderPainel({
      previsaoDisponivel: false,
      previsaoAtualizadaEm: '2026-10-10T07:00:00-03:00',
    })
    abrirApp('/')

    const aviso = await screen.findByText('Não conseguimos atualizar a previsão')
    expect(aviso.parentElement).toHaveTextContent(/Mostrando os avisos de .*10\/10 às 7h/)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('sem nenhuma lavoura, vai marcar a primeira', async () => {
    jaEntrou()
    responderPainel({ cultivos: [] })
    const roteador = abrirApp('/')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Onde fica sua lavoura?' }),
    ).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/lavouras/nova')
  })

  it('quando o servidor falha, mostra o erro e deixa tentar de novo', async () => {
    jaEntrou()
    servidor.use(http.get('/api/painel', () => HttpResponse.json({}, { status: 500 })))
    abrirApp('/')

    expect(await screen.findByRole('alert')).toHaveTextContent(MENSAGENS.servidor)

    servidor.resetHandlers()
    await userEvent.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByRole('list')).toBeInTheDocument()
  })

  it('no celular, leva para a Minha conta pelo botão do alto', async () => {
    jaEntrou()
    abrirApp('/')

    await userEvent.click(await screen.findByRole('link', { name: 'Minha conta' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Minha conta' })).toBeInTheDocument()
  })

  it('no computador, mostra quando a previsão foi atualizada e a legenda do mapa', async () => {
    telaDeComputador()
    jaEntrou()
    abrirApp('/')

    expect(await screen.findByText('Previsão atualizada hoje às 7h')).toBeInTheDocument()
    expect(screen.getByText('Legenda')).toBeInTheDocument()
    expect(
      within(screen.getByRole('main')).getByRole('link', { name: 'Nova lavoura' }),
    ).toHaveAttribute('href', '/lavouras/nova')
  })
})
