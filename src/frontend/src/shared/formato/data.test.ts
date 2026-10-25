import { afterEach, describe, expect, it, vi } from 'vitest'
import { dataCompleta, diaCurto, diaDaSemana, diaEMes, hoje, quandoFoi } from './data'

afterEach(() => {
  vi.useRealTimers()
})

describe('hoje', () => {
  it('usa o dia do aparelho, mesmo à noite, quando em Londres já é amanhã', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 18, 23, 30) })

    expect(hoje()).toBe('2026-10-18')
  })
})

describe('quandoFoi', () => {
  const agora = new Date(2026, 9, 11, 15, 0)

  it('hoje', () => {
    expect(quandoFoi(new Date(2026, 9, 11, 7, 0).toISOString(), agora)).toBe('hoje às 7h')
  })

  it('ontem, com a data', () => {
    expect(quandoFoi(new Date(2026, 9, 10, 7, 0).toISOString(), agora)).toBe('ontem, 10/10 às 7h')
  })

  it('antes de ontem, só a data, com os minutos quando tem', () => {
    expect(quandoFoi(new Date(2026, 9, 8, 7, 30).toISOString(), agora)).toBe('08/10 às 7h30')
  })
})

describe('datas da API', () => {
  it('reorganiza sem mudar o dia', () => {
    expect(diaEMes('2026-10-15')).toBe('15/10')
    expect(dataCompleta('2026-10-15')).toBe('15/10/2026')
  })

  it('acha o dia da semana pelo calendário do aparelho', () => {
    expect(diaDaSemana('2026-10-15')).toBe('quinta')
    expect(diaDaSemana('2026-10-11')).toBe('domingo')
  })

  it('chama o dia de hoje de "Hoje"', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 11, 9, 0) })

    expect(diaCurto('2026-10-11')).toBe('Hoje')
    expect(diaCurto('2026-10-12')).toBe('Seg')
  })
})
