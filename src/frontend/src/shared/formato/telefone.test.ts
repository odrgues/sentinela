import { describe, expect, it } from 'vitest'
import { telefone } from './telefone'

describe('telefone', () => {
  it('mostra o celular do Brasil com DDD', () => {
    expect(telefone('+5534999999999')).toBe('(34) 99999-9999')
    expect(telefone('34999999999')).toBe('(34) 99999-9999')
  })

  it('o fixo de 8 dígitos também', () => {
    expect(telefone('+553433334444')).toBe('(34) 3333-4444')
  })

  it('sem número, fica vazio; o que não reconhece, mostra como veio', () => {
    expect(telefone(null)).toBe('')
    expect(telefone('+1 555 0100')).toBe('+1 555 0100')
  })
})
