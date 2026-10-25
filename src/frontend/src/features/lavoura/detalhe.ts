import { diaEMes } from '../../shared/formato/data'
import type { DetalheDaLavoura, Enso } from './tipos'

const FASES: Record<string, string> = {
  'El Nino': 'El Niño',
  'La Nina': 'La Niña',
}

// "El Niño muito forte nesta safra". Na perene, é o último mês medido: "agora".
export function tituloDoEnso(enso: Enso, perene: boolean) {
  const quando = perene ? 'agora' : 'nesta safra'
  const fase = FASES[enso.fase]
  if (!fase) return `Sem El Niño nem La Niña ${quando}`
  return `${fase} ${enso.intensidade} ${quando}`
}

// "Soja · plantada em 27/08 · 12 ha", ou "Café · lavoura desde 2019 · 8 ha" na perene.
export function resumoDaLavoura(lavoura: DetalheDaLavoura, comMunicipio = false) {
  const plantio =
    lavoura.tipoCiclo === 'perene'
      ? `lavoura desde ${lavoura.dataPlantio.slice(0, 4)}`
      : `plantada em ${diaEMes(lavoura.dataPlantio)}`
  const partes = [lavoura.cultura, plantio]
  if (lavoura.areaHa !== null) partes.push(`${lavoura.areaHa.toLocaleString('pt-BR')} ha`)
  if (comMunicipio) partes.push(lavoura.municipio)
  return partes.join(' · ')
}

// Quanto do ciclo já passou, de 0 a 100, para a barra.
export function porcentagemDoCiclo(diaAtual: number, cicloDias: number) {
  return Math.min(100, Math.max(0, Math.round((diaAtual / cicloDias) * 100)))
}
