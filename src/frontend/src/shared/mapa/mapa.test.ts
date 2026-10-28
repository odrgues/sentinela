import { describe, expect, it } from 'vitest'
import { fotoDeSatelite } from './mapa'

describe('fotoDeSatelite', () => {
  it('pede a foto com o ponto no meio, no tamanho pedido', () => {
    const url = new URL(fotoDeSatelite(0, 0, 400, 200, 2))

    expect(url.searchParams.get('bbox')).toBe('-400,-200,400,200')
    expect(url.searchParams.get('size')).toBe('400,200')
    expect(url.searchParams.get('f')).toBe('image')
  })

  it('converte a latitude para a projeção dos mapas da web', () => {
    const url = new URL(fotoDeSatelite(-19.75, -47.93, 100, 100, 1))
    const [oeste, sul, leste, norte] = url.searchParams.get('bbox')!.split(',').map(Number)

    expect((oeste + leste) / 2).toBeCloseTo(-5335543, -1)
    expect((sul + norte) / 2).toBeCloseTo(-2243438, -1)
  })
})
