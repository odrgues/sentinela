import type { Cultura } from '../../shared/api/tipos/cultura'
import type { MudancasNaLavoura } from './api'
import type { DadosDaLavoura, DetalheDaLavoura, Local } from './tipos'
import { areaEmHectares } from './validacao'

// O detalhe traz o município junto ("Uberaba – MG"); a edição precisa da cidade e da UF.
export function localDaLavoura(lavoura: DetalheDaLavoura): Local {
  const [cidade, uf = ''] = lavoura.municipio.split(/\s+[–-]\s+/)
  return { latitude: lavoura.latitude, longitude: lavoura.longitude, cidade, uf }
}

// Os campos já preenchidos. Se a API não mandar o culturaId, acha a cultura pelo nome.
export function dadosDaLavoura(lavoura: DetalheDaLavoura, culturas: Cultura[]): DadosDaLavoura {
  const culturaId =
    lavoura.culturaId ?? culturas.find(({ nome }) => nome === lavoura.cultura)?.id ?? null
  return {
    culturaId,
    apelido: lavoura.apelido,
    dataPlantio: lavoura.dataPlantio,
    area: lavoura.areaHa === null ? '' : lavoura.areaHa.toLocaleString('pt-BR'),
  }
}

type Situacao = { dados: DadosDaLavoura; local: Local }

// O PATCH leva só o que mudou. O local vai inteiro, porque a cidade depende do ponto.
export function oQueMudou(antes: Situacao, depois: Situacao): MudancasNaLavoura {
  const mudancas: MudancasNaLavoura = {}
  const apelido = depois.dados.apelido.trim()
  const areaAntes = areaEmHectares(antes.dados.area) ?? null
  const areaDepois = areaEmHectares(depois.dados.area) ?? null

  if (depois.dados.culturaId !== null && depois.dados.culturaId !== antes.dados.culturaId) {
    mudancas.culturaId = depois.dados.culturaId
  }
  if (apelido !== antes.dados.apelido) mudancas.apelido = apelido
  if (depois.dados.dataPlantio !== antes.dados.dataPlantio) {
    mudancas.dataPlantio = depois.dados.dataPlantio
  }
  if (areaDepois !== areaAntes) mudancas.areaHa = areaDepois
  if (
    depois.local.latitude !== antes.local.latitude ||
    depois.local.longitude !== antes.local.longitude
  ) {
    Object.assign(mudancas, depois.local)
  }
  return mudancas
}
