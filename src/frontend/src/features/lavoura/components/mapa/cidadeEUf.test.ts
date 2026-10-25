import { describe, expect, it } from 'vitest'
import { cidadeEUf } from './cidadeEUf'

const uberaba = {
  address_components: [
    { long_name: 'Uberaba', short_name: 'Uberaba', types: ['administrative_area_level_2'] },
    { long_name: 'Minas Gerais', short_name: 'MG', types: ['administrative_area_level_1'] },
    { long_name: 'Brasil', short_name: 'BR', types: ['country', 'political'] },
  ],
}

describe('cidadeEUf', () => {
  it('pega o município e a sigla do estado', () => {
    expect(cidadeEUf([uberaba])).toEqual({ cidade: 'Uberaba', uf: 'MG' })
  })

  it('pula os resultados que não têm município', () => {
    const soEstado = { address_components: uberaba.address_components.slice(1) }

    expect(cidadeEUf([soEstado, uberaba])).toEqual({ cidade: 'Uberaba', uf: 'MG' })
  })

  it('fora do Brasil não acha nada', () => {
    const assuncao = {
      address_components: [
        { long_name: 'Asunción', short_name: 'Asunción', types: ['administrative_area_level_2'] },
        { long_name: 'Central', short_name: 'Central', types: ['administrative_area_level_1'] },
        { long_name: 'Paraguay', short_name: 'PY', types: ['country'] },
      ],
    }

    expect(cidadeEUf([assuncao])).toBeNull()
  })

  it('sem resultado não acha nada', () => {
    expect(cidadeEUf([])).toBeNull()
  })
})
