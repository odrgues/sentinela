import type { LavouraNoPainel } from './tipos'

// "Bom dia", "Boa tarde" e "Boa noite" vêm da hora do aparelho, e não da API.
export function saudacao(hora: number) {
  if (hora >= 5 && hora < 12) return 'Bom dia'
  if (hora >= 12 && hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

// A linha embaixo do nome da lavoura: "Soja · dia 45 de 120 · Floração" ou "Café · safra 2026/27".
export function andamento(lavoura: LavouraNoPainel) {
  const partes = [lavoura.cultura]
  if (lavoura.diaAtual !== null && lavoura.cicloDias !== null) {
    partes.push(`dia ${lavoura.diaAtual} de ${lavoura.cicloDias}`)
  } else if (lavoura.safra) {
    partes.push(`safra ${lavoura.safra}`)
  }
  if (lavoura.fase) partes.push(lavoura.fase)
  return partes.join(' · ')
}
