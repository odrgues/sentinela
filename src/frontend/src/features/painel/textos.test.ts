import { describe, expect, it } from 'vitest'
import { andamento, saudacao } from './textos'
import type { LavouraNoPainel } from './tipos'

const soja: LavouraNoPainel = {
  id: 1,
  apelido: 'Talhão do fundo',
  cultura: 'Soja',
  diaAtual: 45,
  cicloDias: 120,
  latitude: -19.7,
  longitude: -47.9,
  aviso: { tipo: 'calor', severidade: 'critico', mensagem: 'Calor forte na quinta' },
}

describe('saudacao', () => {
  it('bom dia das 5h ao meio-dia, boa tarde até as 18h, boa noite no resto', () => {
    expect(saudacao(5)).toBe('Bom dia')
    expect(saudacao(11)).toBe('Bom dia')
    expect(saudacao(12)).toBe('Boa tarde')
    expect(saudacao(17)).toBe('Boa tarde')
    expect(saudacao(18)).toBe('Boa noite')
    expect(saudacao(2)).toBe('Boa noite')
  })
})

describe('andamento', () => {
  it('mostra o dia do ciclo', () => {
    expect(andamento(soja)).toBe('Soja · dia 45 de 120')
  })

  it('na perene, mostra a safra', () => {
    expect(
      andamento({ ...soja, cultura: 'Café', diaAtual: null, cicloDias: null, safra: '2026/27' }),
    ).toBe('Café · safra 2026/27')
  })

  it('sem dia nem safra, só a cultura', () => {
    expect(andamento({ ...soja, diaAtual: null, cicloDias: null })).toBe('Soja')
  })
})
