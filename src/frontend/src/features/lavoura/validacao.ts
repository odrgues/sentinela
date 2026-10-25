import { hoje } from '../../shared/formato/data'
import type { DadosDaLavoura, UnidadeDeArea } from './tipos'

export const TAMANHO_MAXIMO_DO_APELIDO = 80

export type ErrosDaLavoura = Partial<Record<'cultura' | 'apelido' | 'dataPlantio' | 'area', string>>

const METROS_QUADRADOS_POR_HECTARE = 10000

// A área chega como texto do campo: aceita "12", "12,5" e "12.5". Em m², vira hectares (500 m² = 0,05 ha).
export function areaEmHectares(area: string, unidade: UnidadeDeArea = 'ha'): number | undefined {
  const texto = area.trim().replace(',', '.')
  if (!texto) return undefined
  const numero = Number(texto)
  return unidade === 'm2' ? numero / METROS_QUADRADOS_POR_HECTARE : numero
}

// Para preencher o campo na edição: área pequena (menos de 1 ha) aparece em m².
export function areaNoCampo(areaHa: number | null): { area: string; unidade: UnidadeDeArea } {
  if (areaHa === null) return { area: '', unidade: 'ha' }
  if (areaHa < 1) {
    return {
      area: Math.round(areaHa * METROS_QUADRADOS_POR_HECTARE).toLocaleString('pt-BR'),
      unidade: 'm2',
    }
  }
  return { area: areaHa.toLocaleString('pt-BR'), unidade: 'ha' }
}

export function validarLavoura(dados: DadosDaLavoura): ErrosDaLavoura {
  const erros: ErrosDaLavoura = {}
  const apelido = dados.apelido.trim()
  const area = areaEmHectares(dados.area, dados.unidade)

  if (dados.culturaId === null) erros.cultura = 'Escolha o que você plantou.'
  if (!apelido) erros.apelido = 'Dê um nome para a lavoura.'
  else if (apelido.length > TAMANHO_MAXIMO_DO_APELIDO) erros.apelido = 'Use até 80 caracteres.'
  if (!dados.dataPlantio) erros.dataPlantio = 'Escolha a data.'
  else if (dados.dataPlantio > hoje()) erros.dataPlantio = 'A data não pode ser depois de hoje.'
  if (area !== undefined && !(area > 0)) erros.area = 'Use um número maior que zero.'

  return erros
}
