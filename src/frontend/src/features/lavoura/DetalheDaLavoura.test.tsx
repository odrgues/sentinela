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

  it('o cartão do El Niño mostra o efeito na região e o que fazer, com a fonte', async () => {
    responderDetalhe({
      enso: {
        fase: 'El Nino',
        intensidade: 'forte',
        indice: 1.8,
        mesPlantio: '2026-07',
        frase: 'Você plantou em julho de 2026, durante um El Niño forte.',
        efeito: 'Na região, o verão tende a ser mais quente.',
        oQueFazer: 'Acompanhe os avisos e planeje a irrigação.',
        fonte: 'CPTEC/INPE',
      },
    })
    await abrirTalhao()

    expect(screen.getByText('Na região, o verão tende a ser mais quente.')).toBeInTheDocument()
    expect(screen.getByText('Acompanhe os avisos e planeje a irrigação.')).toBeInTheDocument()
    expect(screen.getByText('Fonte: CPTEC/INPE')).toBeInTheDocument()
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

  it('o aviso mostra o que fazer, quando a API manda', async () => {
    responderDetalhe({
      alertas: [
        {
          tipo: 'deficit_hidrico',
          severidade: 'atencao',
          data: '2026-10-25',
          mensagem: 'Pouca chuva: só 22 mm previstos na semana.',
          porque: 'A lavoura de soja precisa de 26,5 a 47,1 mm de chuva por semana.',
          oQueFazer: 'Se puder, irrigue. Adie a adubação de cobertura até a chuva voltar.',
        },
        {
          tipo: 'favoravel',
          severidade: 'info',
          data: '2026-10-25',
          mensagem: 'Tudo certo esta semana.',
          porque: 'Dentro da faixa ideal.',
          oQueFazer: null,
        },
      ],
    })
    await abrirTalhao()

    const avisos = screen.getByRole('heading', { level: 2, name: 'Avisos desta semana' })
      .parentElement as HTMLElement
    expect(
      within(avisos).getByText(
        'Se puder, irrigue. Adie a adubação de cobertura até a chuva voltar.',
      ),
    ).toBeInTheDocument()
    // Só o aviso que tem texto mostra o "O que fazer".
    expect(within(avisos).getAllByText('O que fazer')).toHaveLength(1)
  })

  it('mostra a fase do ciclo, com o que ela pede e a fonte', async () => {
    responderDetalhe({
      fase: {
        nome: 'Floração',
        diaInicio: 35,
        diaFim: 50,
        orientacao: 'Fase mais sensível à falta de água.',
        fonte: 'Embrapa Arroz e Feijão (500 Perguntas Feijão, p. 41)',
      },
    })
    await abrirTalhao()

    expect(screen.getByText('Floração · dias 35 a 50')).toBeInTheDocument()
    expect(screen.getByText('Fase mais sensível à falta de água.')).toBeInTheDocument()
    expect(
      screen.getByText('Fonte: Embrapa Arroz e Feijão (500 Perguntas Feijão, p. 41)'),
    ).toBeInTheDocument()
  })

  it('na colheita contínua, mostra quando a colheita começa', async () => {
    responderDetalhe({
      cultura: 'Morango',
      tipoCiclo: 'continua',
      diaAtual: 160,
      cicloDias: 220,
      colheitaPrevista: '2026-07-07',
    })
    await abrirTalhao()

    expect(screen.getByText('Dia 160 de 220')).toBeInTheDocument()
    expect(screen.getByText('Colheita a partir de 07/07')).toBeInTheDocument()
  })

  it('na perene sem safra que já produz, diz desde quando', async () => {
    responderDetalhe({
      cultura: 'Banana',
      tipoCiclo: 'perene',
      dataPlantio: '2023-01-10',
      diaAtual: null,
      cicloDias: null,
      safra: null,
      colheitaPrevista: '2024-07-03',
    })
    await abrirTalhao()

    expect(screen.getByText('Produzindo desde 03/07/2024')).toBeInTheDocument()
  })

  it('sem aviso na semana, diz que está tudo certo', async () => {
    responderDetalhe({ alertas: [] })
    await abrirTalhao()

    expect(screen.getByText('Tudo certo esta semana')).toBeInTheDocument()
    const resumo = screen.getByRole('region', { name: 'Resumo da semana' })
    expect(resumo).toHaveTextContent('Semana tranquila para a lavoura')
    expect(within(resumo).queryByRole('link')).not.toBeInTheDocument()
  })

  it('resume a semana embaixo da foto pelo aviso mais sério, com o caminho para o que fazer', async () => {
    await abrirTalhao()

    const resumo = screen.getByRole('region', { name: 'Resumo da semana' })
    expect(resumo).toHaveTextContent('Risco para a lavoura nesta semana')
    expect(resumo).toHaveTextContent('Calor de 36 °C.')
    expect(resumo).toHaveTextContent('E mais 1 aviso.')
    expect(within(resumo).getByRole('link', { name: 'Ver o que fazer' })).toHaveAttribute(
      'href',
      '#avisos-da-semana',
    )
  })

  it('o gráfico explica a faixa ideal, o limite de calor e a chuva da semana', async () => {
    await abrirTalhao()

    const legenda = screen.getByRole('list', { name: 'Como ler o gráfico' })
    expect(legenda).toHaveTextContent('Média ideal do dia: 20 a 30 °C')
    expect(legenda).toHaveTextContent('Calor forte acima de 35 °C')
    expect(legenda).not.toHaveTextContent('Frio forte')
    expect(legenda).toHaveTextContent('Chuva na semana: 22 mm (o ideal é de 26,5 a 47,1 mm)')
  })

  it('o ciclo mostra a próxima fase', async () => {
    await abrirTalhao()

    expect(
      screen.getByText('Depois: Florescimento e enchimento de grãos, a partir do dia 48'),
    ).toBeInTheDocument()
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
    expect(dias[4]).toHaveTextContent('Máxima de 36°, mínima de 22°')
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

  it('no computador, passar o mouse num aviso acende o dia dele no gráfico', async () => {
    telaDeComputador()
    await abrirTalhao()

    const dias = within(screen.getByRole('list', { name: 'Próximos 7 dias' })).getAllByRole(
      'listitem',
    )
    const avisos = screen.getByRole('heading', { level: 2, name: 'Avisos desta semana' })
      .parentElement as HTMLElement
    const calor = within(avisos).getByText(/Calor de 36 °C/)

    await userEvent.hover(calor)
    expect(dias[4]).toHaveAttribute('aria-current', 'date')

    await userEvent.unhover(calor)
    expect(dias[4]).not.toHaveAttribute('aria-current')
  })
})
