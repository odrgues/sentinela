import { describe, expect, it } from 'vitest'
import { etiquetasVisiveis, type PontoNaTela } from './etiquetas'

const PINO = { largura: 36, altura: 46 }

function ponto(id: number, x: number, y: number, prioridade = 2, apelido = 'Talhão'): PontoNaTela {
  return { id, x, y, prioridade, apelido }
}

describe('etiquetasVisiveis', () => {
  it('mostra todos os nomes quando as lavouras estão longe umas das outras', () => {
    const visiveis = etiquetasVisiveis(
      [ponto(1, 100, 200), ponto(2, 500, 200), ponto(3, 300, 500)],
      PINO,
    )

    expect([...visiveis].sort()).toEqual([1, 2, 3])
  })

  it('esconde o nome que cobriria outro, e a lavoura mais urgente fica com o dela', () => {
    const juntas = [ponto(1, 300, 300, 2), ponto(2, 310, 300, 0), ponto(3, 305, 300, 1)]

    const visiveis = etiquetasVisiveis(juntas, PINO)

    expect([...visiveis]).toEqual([2])
  })

  it('no empate de urgência, a lavoura de menor id fica com o nome', () => {
    const visiveis = etiquetasVisiveis([ponto(7, 300, 300), ponto(4, 305, 300)], PINO)

    expect([...visiveis]).toEqual([4])
  })

  it('esconde o nome que cairia em cima do marcador de outra lavoura', () => {
    // A lavoura 2 está logo acima da 1: o nome da 1 cobriria o marcador da 2.
    const visiveis = etiquetasVisiveis([ponto(1, 300, 300, 0), ponto(2, 300, 240, 1)], PINO)

    expect(visiveis.has(1)).toBe(false)
    expect(visiveis.has(2)).toBe(true)
  })

  it('o nome comprido ocupa mais lugar que o curto', () => {
    const lado = (apelido: string) =>
      etiquetasVisiveis([ponto(1, 300, 300, 0, apelido), ponto(2, 372, 300, 1, 'Roça')], PINO).has(
        2,
      )

    expect(lado('Mi')).toBe(true)
    expect(lado('Fazenda Cerrado do Meio')).toBe(false)
  })

  it('sem lavouras, sem nomes', () => {
    expect(etiquetasVisiveis([], PINO).size).toBe(0)
  })
})
