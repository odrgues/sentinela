import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProvedorDeTema } from './ProvedorDeTema'

describe('EstiloGlobal', () => {
  // As cores do canvas ficam escritas aqui: comparar com o próprio cores.ts nunca falharia.
  it('pinta a página de branco e o texto verde-escuro do canvas', () => {
    render(<ProvedorDeTema>{null}</ProvedorDeTema>)

    const estilo = getComputedStyle(document.body)
    expect(estilo.backgroundColor).toBe('rgb(255, 255, 255)')
    expect(estilo.color).toBe('rgb(28, 42, 31)')
  })
})
