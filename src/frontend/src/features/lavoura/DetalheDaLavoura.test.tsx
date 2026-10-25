import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it } from 'vitest'
import { detalhe } from '../../mocks/dados/detalhe'
import { servidor } from '../../mocks/servidor'
import { abrirApp } from '../../test/abrirApp'
import { jaEntrou } from '../../test/sessao'
import { telaDeComputador } from '../../test/tela'

afterEach(() => {
  servidor.events.removeAllListeners()
})

function responderDetalhe(mudancas: object) {
  servidor.use(http.get('/api/cultivos/1', () => HttpResponse.json({ ...detalhe(1), ...mudancas })))
}

async function abrirTalhao() {
  jaEntrou()
  const roteador = abrirApp('/lavouras/1')
  await screen.findByRole('heading', { level: 1, name: 'Talhão do fundo' })
  return roteador
}

describe('Detalhe da lavoura', () => {
  it('mostra o resumo, o ciclo e o El Niño', async () => {
    await abrirTalhao()

    expect(screen.getByText('Soja · plantada em 27/08 · 12 ha')).toBeInTheDocument()
    expect(screen.getByText('Dia 45 de 120')).toBeInTheDocument()
    expect(screen.getByText('Colheita prevista: 25/12')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '38% do ciclo concluído' })).toBeInTheDocument()
    expect(screen.getByText('El Niño muito forte nesta safra')).toBeInTheDocument()
  })

  it('na perene, mostra a safra no lugar do dia', async () => {
    responderDetalhe({
      cultura: 'Café',
      tipoCiclo: 'perene',
      dataPlantio: '2019-03-01',
      diaAtual: null,
      cicloDias: null,
      safra: '2026/27',
      colheitaPrevista: '2027-05-01',
    })
    await abrirTalhao()

    expect(screen.getByText('Safra 2026/27')).toBeInTheDocument()
    expect(screen.getByText('Colheita a partir de 01/05/2027')).toBeInTheDocument()
    expect(screen.getByText('Café · lavoura desde 2019 · 12 ha')).toBeInTheDocument()
    expect(screen.getByText('El Niño muito forte agora')).toBeInTheDocument()
  })

  it('sem El Niño nem La Niña registrados, esconde o cartão', async () => {
    responderDetalhe({ enso: null })
    await abrirTalhao()

    expect(screen.queryByText(/El Niño/)).not.toBeInTheDocument()
  })

  it('cada aviso da semana abre o "por quê"', async () => {
    await abrirTalhao()

    const avisos = screen.getByRole('heading', { level: 2, name: 'Avisos desta semana' })
      .parentElement as HTMLElement
    const [primeiro] = within(avisos).getAllByRole('button', { name: 'Por quê?' })
    expect(primeiro).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(primeiro)

    expect(primeiro).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByText(/A soja se desenvolve bem com média entre 20 °C e 30 °C/),
    ).toBeInTheDocument()
  })

  it('sem aviso na semana, diz que está tudo certo', async () => {
    responderDetalhe({ alertas: [] })
    await abrirTalhao()

    expect(screen.getByText('Tudo certo esta semana')).toBeInTheDocument()
  })

  it('mostra a previsão dos 7 dias, com a frase e a chuva de cada dia', async () => {
    await abrirTalhao()

    const dias = within(screen.getByRole('list', { name: 'Próximos 7 dias' })).getAllByRole(
      'listitem',
    )
    expect(dias).toHaveLength(7)
    expect(dias[0]).toHaveTextContent('Hoje')
    expect(dias[0]).toHaveTextContent('Sem chuva')
    expect(dias[4]).toHaveTextContent('Calor forte: risco')
    expect(dias[6]).toHaveTextContent('18 mm de chuva')
    expect(within(dias[6]).getByRole('img', { name: 'Chuva' })).toBeInTheDocument()
  })

  it('com a previsão fora do ar, avisa em cima dos dias', async () => {
    responderDetalhe({ previsaoDisponivel: false })
    await abrirTalhao()

    expect(screen.getByText('Não conseguimos atualizar a previsão')).toBeInTheDocument()
  })

  it('o histórico filtra pelo nível e carrega mais de 20 em 20', async () => {
    await abrirTalhao()

    await userEvent.click(screen.getByRole('button', { name: 'Histórico' }))
    expect(screen.getByRole('button', { name: 'Histórico' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )

    const lista = await screen.findByRole('list')
    expect(within(lista).getAllByRole('listitem')).toHaveLength(20)

    await userEvent.click(screen.getByRole('button', { name: 'Ver mais avisos' }))
    expect(await within(lista).findAllByRole('listitem')).toHaveLength(25)
    expect(screen.queryByRole('button', { name: 'Ver mais avisos' })).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Crítico' }))
    const soCriticos = await screen.findByRole('list')
    expect(within(soCriticos).getAllByRole('listitem')).toHaveLength(5)
    expect(soCriticos).not.toHaveTextContent('Tudo certo')
  })

  it('"Já colhi" pede confirmação, salva e volta para o painel', async () => {
    const corpos: unknown[] = []
    servidor.events.on('request:start', async ({ request }) => {
      if (request.method === 'PATCH') corpos.push(await request.clone().json())
    })
    const roteador = await abrirTalhao()

    await userEvent.click(screen.getByRole('button', { name: 'Já colhi' }))
    const confirmacao = screen.getByRole('dialog', { name: 'Já colheu o Talhão do fundo?' })
    await userEvent.click(within(confirmacao).getByRole('button', { name: 'Sim, já colhi' }))

    expect(await screen.findByRole('heading', { level: 1, name: /, João$/ })).toBeInTheDocument()
    expect(roteador.state.location.pathname).toBe('/')
    expect(corpos).toEqual([{ status: 'colhido' }])
    expect(screen.getByRole('status', { name: '' })).toHaveTextContent('Colheita registrada')
  })

  it('a confirmação deixa marcar a lavoura como perdida', async () => {
    const corpos: unknown[] = []
    servidor.events.on('request:start', async ({ request }) => {
      if (request.method === 'PATCH') corpos.push(await request.clone().json())
    })
    await abrirTalhao()

    await userEvent.click(screen.getByRole('button', { name: 'Já colhi' }))
    await userEvent.click(screen.getByRole('button', { name: 'A lavoura foi perdida' }))

    await screen.findByRole('heading', { level: 1, name: /, João$/ })
    expect(corpos).toEqual([{ status: 'perdido' }])
  })

  it('a confirmação fecha no Cancelar e no Esc, sem salvar', async () => {
    await abrirTalhao()

    await userEvent.click(screen.getByRole('button', { name: 'Já colhi' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Já colhi' })).toHaveFocus()

    await userEvent.click(screen.getByRole('button', { name: 'Já colhi' }))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('leva para editar a lavoura', async () => {
    await abrirTalhao()

    expect(screen.getByRole('link', { name: 'Editar' })).toHaveAttribute(
      'href',
      '/lavouras/1/editar',
    )
  })

  it('a lavoura colhida avisa que não recebe mais avisos e não tem as ações', async () => {
    responderDetalhe({ status: 'colhido' })
    await abrirTalhao()

    expect(screen.getByText(/Esta lavoura foi colhida/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Já colhi' })).not.toBeInTheDocument()
  })

  it('uma lavoura que não existe (ou de outra pessoa) mostra que não foi encontrada', async () => {
    jaEntrou()
    abrirApp('/lavouras/99')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Lavoura não encontrada' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir para o painel' })).toHaveAttribute('href', '/')
  })

  it('no computador, mostra a previsão em cartões e o histórico em tabela', async () => {
    telaDeComputador()
    await abrirTalhao()

    expect(screen.getByText('Soja · plantada em 27/08 · 12 ha · Uberaba – MG')).toBeInTheDocument()
    expect(screen.getByText(/Previsão atualizada hoje às 7h/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Histórico' }))
    const tabela = await screen.findByRole('table')
    expect(within(tabela).getAllByRole('row')).toHaveLength(21)
  })
})
