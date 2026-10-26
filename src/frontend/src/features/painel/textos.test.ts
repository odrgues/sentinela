import { describe, expect, it } from 'vitest'
import { maisUrgente, proximaColheita, saudacao } from './textos'
import type { LavouraNoPainel } from './tipos'

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

function lavoura(apelido: string, mudancas: Partial<LavouraNoPainel> = {}): LavouraNoPainel {
  return {
    id: 1,
    apelido,
    cultura: 'Soja',
    diaAtual: 45,
    cicloDias: 120,
    latitude: -19.7,
    longitude: -47.9,
    aviso: { tipo: 'nenhum', severidade: 'info', mensagem: 'Tudo certo esta semana' },
    ...mudancas,
  }
}

const calor = { tipo: 'calor', severidade: 'critico', mensagem: 'Calor forte na quinta' } as const
const seca = { tipo: 'seca', severidade: 'atencao', mensagem: 'Pouca chuva na semana' } as const

describe('maisUrgente', () => {
  it('escolhe o aviso crítico antes do de atenção, seja qual for a ordem', () => {
    const urgente = maisUrgente([
      lavoura('Roça', { aviso: seca }),
      lavoura('Talhão', { aviso: calor }),
    ])
    expect(urgente?.apelido).toBe('Talhão')
  })

  it('não escolhe nenhuma quando está tudo certo', () => {
    expect(maisUrgente([lavoura('Horta')])).toBeNull()
  })
})

describe('proximaColheita', () => {
  it('escolhe a lavoura com menos dias até o fim do ciclo', () => {
    expect(
      proximaColheita([
        lavoura('Soja', { diaAtual: 45, cicloDias: 120 }),
        lavoura('Morango', { diaAtual: 160, cicloDias: 220 }),
      ]),
    ).toEqual({ apelido: 'Morango', faltam: 60 })
  })

  it('não conta dias negativos depois do fim do ciclo', () => {
    expect(proximaColheita([lavoura('Milho', { diaAtual: 130, cicloDias: 120 })])).toEqual({
      apelido: 'Milho',
      faltam: 0,
    })
  })

  it('deixa as perenes de fora', () => {
    expect(
      proximaColheita([lavoura('Café', { diaAtual: null, cicloDias: null, safra: '2026/27' })]),
    ).toBeNull()
  })
})
