import type { Severidade } from '../../shared/ui/nivel'
import type { LavouraNoPainel } from './tipos'

// "Bom dia", "Boa tarde" e "Boa noite" vêm da hora do aparelho, e não da API.
export function saudacao(hora: number) {
  if (hora >= 5 && hora < 12) return 'Bom dia'
  if (hora >= 12 && hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

const GRAVIDADE: Record<Severidade, number> = { critico: 0, atencao: 1, info: 2 }

// A lavoura com o aviso mais grave da semana, ou nada quando está tudo certo em todas.
export function maisUrgente(lavouras: LavouraNoPainel[]) {
  const comAviso = lavouras.filter((lavoura) => lavoura.aviso.severidade !== 'info')
  if (comAviso.length === 0) return null
  return [...comAviso].sort(
    (a, b) => GRAVIDADE[a.aviso.severidade] - GRAVIDADE[b.aviso.severidade],
  )[0]
}

// A lavoura anual mais perto de colher e quantos dias faltam (0 quando o ciclo já fechou).
// As perenes ficam de fora: elas têm safra, e não dia do ciclo.
export function proximaColheita(lavouras: LavouraNoPainel[]) {
  const comCiclo = lavouras.flatMap(({ diaAtual, cicloDias, ...lavoura }) =>
    diaAtual !== null && cicloDias !== null
      ? [{ apelido: lavoura.apelido, faltam: Math.max(0, cicloDias - diaAtual) }]
      : [],
  )
  if (comCiclo.length === 0) return null
  return comCiclo.sort((a, b) => a.faltam - b.faltam)[0]
}
