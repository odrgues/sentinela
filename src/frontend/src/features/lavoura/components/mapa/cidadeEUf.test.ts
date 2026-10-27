import { describe, expect, it } from 'vitest'
import { cidadeEUf } from './cidadeEUf'

const uberaba = {
  city: 'Uberaba',
  state: 'Minas Gerais',
  'ISO3166-2-lvl4': 'BR-MG',
  country: 'Brasil',
  country_code: 'br',
}

describe('cidadeEUf', () => {
  it('pega o município e a sigla do estado', () => {
    expect(cidadeEUf(uberaba)).toEqual({ cidade: 'Uberaba', uf: 'MG' })
  })

  it('acha o município que vem como municipality', () => {
    const saoPaulo = {
      municipality: 'São Paulo',
      'ISO3166-2-lvl4': 'BR-SP',
      country_code: 'br',
    }

    expect(cidadeEUf(saoPaulo)).toEqual({ cidade: 'São Paulo', uf: 'SP' })
  })

  it('fora do Brasil não acha nada', () => {
    const assuncao = { city: 'Assunção', 'ISO3166-2-lvl4': 'PY-ASU', country_code: 'py' }

    expect(cidadeEUf(assuncao)).toBeNull()
  })

  it('sem município não acha nada', () => {
    expect(cidadeEUf({ 'ISO3166-2-lvl4': 'BR-MG', country_code: 'br' })).toBeNull()
  })

  it('no mar, sem endereço, não acha nada', () => {
    expect(cidadeEUf(undefined)).toBeNull()
  })
})
