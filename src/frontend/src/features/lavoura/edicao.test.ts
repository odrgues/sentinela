import { describe, expect, it } from 'vitest'
import { culturas } from '../../mocks/dados/culturas'
import { dadosDaLavoura, localDaLavoura, oQueMudou } from './edicao'
import type { DetalheDaLavoura } from './tipos'

const lavoura = {
  apelido: 'Talhão do fundo',
  cultura: 'Soja',
  dataPlantio: '2026-08-27',
  areaHa: 12.5,
  municipio: 'Uberaba – MG',
  latitude: -19.7,
  longitude: -47.9,
} as DetalheDaLavoura

describe('localDaLavoura', () => {
  it('separa a cidade e a UF do município', () => {
    expect(localDaLavoura(lavoura)).toEqual({
      latitude: -19.7,
      longitude: -47.9,
      cidade: 'Uberaba',
      uf: 'MG',
    })
    expect(localDaLavoura({ ...lavoura, municipio: 'Patos de Minas - MG' }).cidade).toBe(
      'Patos de Minas',
    )
  })
})

describe('dadosDaLavoura', () => {
  it('preenche os campos, com a área com vírgula', () => {
    expect(dadosDaLavoura(lavoura, culturas)).toEqual({
      culturaId: 3,
      apelido: 'Talhão do fundo',
      dataPlantio: '2026-08-27',
      area: '12,5',
    })
  })

  it('usa o culturaId quando a API manda', () => {
    expect(dadosDaLavoura({ ...lavoura, culturaId: 9 }, culturas).culturaId).toBe(9)
  })
})

describe('oQueMudou', () => {
  const antes = { dados: dadosDaLavoura(lavoura, culturas), local: localDaLavoura(lavoura) }

  it('nada mudou, nada vai', () => {
    expect(oQueMudou(antes, antes)).toEqual({})
  })

  it('manda só os campos mudados, e a área apagada vai como null', () => {
    const depois = {
      ...antes,
      dados: { ...antes.dados, apelido: ' Talhão novo ', area: '' },
    }

    expect(oQueMudou(antes, depois)).toEqual({ apelido: 'Talhão novo', areaHa: null })
  })

  it('o local mudado vai inteiro', () => {
    const local = { latitude: -18.9, longitude: -48.2, cidade: 'Uberlândia', uf: 'MG' }

    expect(oQueMudou(antes, { ...antes, local })).toEqual(local)
  })
})
