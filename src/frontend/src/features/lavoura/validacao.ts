import { hoje } from '../../shared/formato/data'
import type { DadosDaLavoura } from './tipos'

export const TAMANHO_MAXIMO_DO_APELIDO = 80

export type ErrosDaLavoura = Partial<Record<'cultura' | 'apelido' | 'dataPlantio' | 'area', string>>

// A área chega como texto do campo: aceita "12", "12,5" e "12.5".
export function areaEmHectares(area: string): number | undefined {
  const texto = area.trim().replace(',', '.')
  return texto ? Number(texto) : undefined
}

export function validarLavoura(dados: DadosDaLavoura): ErrosDaLavoura {
  const erros: ErrosDaLavoura = {}
  const apelido = dados.apelido.trim()
  const area = areaEmHectares(dados.area)

  if (dados.culturaId === null) erros.cultura = 'Escolha o que você plantou.'
  if (!apelido) erros.apelido = 'Dê um nome para a lavoura.'
  else if (apelido.length > TAMANHO_MAXIMO_DO_APELIDO) erros.apelido = 'Use até 80 caracteres.'
  if (!dados.dataPlantio) erros.dataPlantio = 'Escolha a data.'
  else if (dados.dataPlantio > hoje()) erros.dataPlantio = 'A data não pode ser depois de hoje.'
  if (area !== undefined && !(area > 0)) erros.area = 'Use um número maior que zero.'

  return erros
}
