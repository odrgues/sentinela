import type { LavouraNoPainel } from './tipos'

// "Bom dia", "Boa tarde" e "Boa noite" vêm da hora do aparelho, e não da API.
export function saudacao(hora: number) {
  if (hora >= 5 && hora < 12) return 'Bom dia'
  if (hora >= 12 && hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

// A linha embaixo do nome da lavoura: "Soja · dia 45 de 120" ou "Café · safra 2026/27".
export function andamento(lavoura: LavouraNoPainel) {
  if (lavoura.diaAtual !== null && lavoura.cicloDias !== null) {
    return `${lavoura.cultura} · dia ${lavoura.diaAtual} de ${lavoura.cicloDias}`
  }
  if (lavoura.safra) return `${lavoura.cultura} · safra ${lavoura.safra}`
  return lavoura.cultura
}
