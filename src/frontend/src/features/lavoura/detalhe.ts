import { diaEMes } from '../../shared/formato/data'
import type { DetalheDaLavoura, DiaDePrevisao, Enso, LimitesDaCultura } from './tipos'

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

// O que o El Niño ou a La Niña quer dizer, em linguagem do dia a dia. Os detalhes (o índice, o
// mês medido) ficam no "Saiba mais" do cartão.
export function explicacaoDoEnso(enso: Enso) {
  if (enso.fase === 'El Nino') {
    return 'O mar do Pacífico está mais quente que o normal. Isso pode mudar o calor e a chuva na sua região.'
  }
  if (enso.fase === 'La Nina') {
    return 'O mar do Pacífico está mais frio que o normal. Isso pode mudar o calor e a chuva na sua região.'
  }
  return 'O mar do Pacífico está no normal. O tempo deve seguir o jeito de sempre da região.'
}

// Horta pequena em m² ("300 m²"); lavoura em hectares ("12 ha").
export function areaParaLer(areaHa: number) {
  if (areaHa < 1) return `${Math.round(areaHa * 10000).toLocaleString('pt-BR')} m²`
  return `${areaHa.toLocaleString('pt-BR')} ha`
}

// "Soja · plantada em 27/08 · 12 ha", ou "Café · lavoura desde 2019 · 8 ha" na perene.
export function resumoDaLavoura(lavoura: DetalheDaLavoura, comMunicipio = false) {
  const plantio =
    lavoura.tipoCiclo === 'perene'
      ? `lavoura desde ${lavoura.dataPlantio.slice(0, 4)}`
      : `plantada em ${diaEMes(lavoura.dataPlantio)}`
  const partes = [lavoura.cultura, plantio]
  if (lavoura.areaHa !== null) partes.push(areaParaLer(lavoura.areaHa))
  if (comMunicipio) partes.push(lavoura.municipio)
  return partes.join(' · ')
}

// Quanto do ciclo já passou, de 0 a 100, para a barra.
export function porcentagemDoCiclo(diaAtual: number, cicloDias: number) {
  return Math.min(100, Math.max(0, Math.round((diaAtual / cicloDias) * 100)))
}

// Os limites de calor e de frio só entram no gráfico se estiverem a até 4 °C da semana: um limite
// de frio de 5 °C numa semana de 30 °C achataria tudo.
const PERTO_DA_SEMANA = 4

// A escala de temperatura da semana, a mesma para todos os dias: da menor mínima à maior máxima,
// aberta para caber a faixa ideal da cultura e os limites de calor e de frio que estiverem perto.
// y(°C) é a altura na escala, em % de cima para baixo.
export function escalaDaSemana(previsao: DiaDePrevisao[], limites?: LimitesDaCultura | null) {
  const temperaturas = previsao.flatMap((dia) => [dia.minC, dia.maxC])
  let menor = Math.min(...temperaturas)
  let maior = Math.max(...temperaturas)
  const perto = (limite: number | null | undefined): limite is number =>
    limite != null && limite >= menor - PERTO_DA_SEMANA && limite <= maior + PERTO_DA_SEMANA

  const ideal =
    limites?.mediaIdealMinC != null && limites.mediaIdealMaxC != null
      ? { min: limites.mediaIdealMinC, max: limites.mediaIdealMaxC }
      : null
  const calor = perto(limites?.criticaAltaC) ? limites.criticaAltaC : null
  const frio = perto(limites?.criticaBaixaC) ? limites.criticaBaixaC : null

  for (const valor of [ideal?.min, ideal?.max, calor, frio]) {
    if (valor == null) continue
    menor = Math.min(menor, valor)
    maior = Math.max(maior, valor)
  }
  // Um grau de folga em cima e embaixo, para a barrinha não encostar na borda.
  menor -= 1
  maior += 1

  return {
    y: (graus: number) => ((maior - graus) / (maior - menor)) * 100,
    ideal,
    calor,
    frio,
  }
}
