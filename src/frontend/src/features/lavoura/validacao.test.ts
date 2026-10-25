import { afterEach, describe, expect, it, vi } from 'vitest'
import type { DadosDaLavoura } from './tipos'
import { areaEmHectares, validarLavoura } from './validacao'

const completa: DadosDaLavoura = {
  culturaId: 3,
  apelido: 'Talhão do fundo',
  dataPlantio: '2026-08-27',
  area: '',
}

afterEach(() => {
  vi.useRealTimers()
})

describe('validarLavoura', () => {
  it('uma lavoura completa passa, e a área é opcional', () => {
    expect(validarLavoura(completa)).toEqual({})
  })

  it('pede a cultura, o nome e a data', () => {
    expect(validarLavoura({ culturaId: null, apelido: '  ', dataPlantio: '', area: '' })).toEqual({
      cultura: 'Escolha o que você plantou.',
      apelido: 'Dê um nome para a lavoura.',
      dataPlantio: 'Escolha a data.',
    })
  })

  it('o nome tem até 80 caracteres', () => {
    expect(validarLavoura({ ...completa, apelido: 'a'.repeat(81) }).apelido).toBe(
      'Use até 80 caracteres.',
    )
  })

  it('a data não pode ser depois de hoje', () => {
    vi.useFakeTimers({ now: new Date(2026, 9, 18, 22, 30) })

    expect(validarLavoura({ ...completa, dataPlantio: '2026-10-18' })).toEqual({})
    expect(validarLavoura({ ...completa, dataPlantio: '2026-10-19' }).dataPlantio).toBe(
      'A data não pode ser depois de hoje.',
    )
  })

  it('a área, quando vem, é um número maior que zero', () => {
    expect(validarLavoura({ ...completa, area: '0' }).area).toBe('Use um número maior que zero.')
    expect(validarLavoura({ ...completa, area: 'doze' }).area).toBe('Use um número maior que zero.')
    expect(validarLavoura({ ...completa, area: '12,5' })).toEqual({})
  })
})

describe('areaEmHectares', () => {
  it('aceita vírgula e ponto, e vazio vira undefined', () => {
    expect(areaEmHectares('12,5')).toBe(12.5)
    expect(areaEmHectares('12.5')).toBe(12.5)
    expect(areaEmHectares(' ')).toBeUndefined()
  })
})
