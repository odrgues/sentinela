import type { TipoCiclo } from '../../shared/api/tipos/cultura'
import type { Severidade } from '../../shared/ui/nivel'
import type { Condicao } from '../../shared/ui/tempo'

export type Ponto = { latitude: number; longitude: number }

// O ponto marcado no mapa, com a cidade e a UF que o Google achou para ele.
export type Local = Ponto & { cidade: string; uf: string }

// Horta se mede em m²; lavoura, em hectares. A API recebe sempre hectares.
export type UnidadeDeArea = 'ha' | 'm2'

// O que a pessoa preenche em "O que você plantou?". Tudo texto, como vem dos campos.
export type DadosDaLavoura = {
  culturaId: number | null
  apelido: string
  dataPlantio: string
  area: string
  // Sem unidade, a área está em hectares.
  unidade?: UnidadeDeArea
}

export type Cultivo = {
  id: number
  apelido: string
  cultura: string
  dataPlantio: string
  colheitaPrevista: string
  areaHa: number | null
  latitude: number
  longitude: number
  municipio: string
  status: 'em_andamento' | 'colhido' | 'perdido'
}

export type NivelDoDia = 'ok' | 'atencao' | 'critico'

export type AlertaDaSemana = {
  tipo: string
  severidade: Severidade
  data: string
  mensagem: string
  porque: string
  // O manejo indicado para esse aviso, com fonte da Embrapa. Nulo quando não há texto para o tipo.
  oQueFazer?: string | null
}

// A fase do ciclo em que a lavoura está hoje e o que ela pede.
export type FaseDoCiclo = {
  nome: string
  diaInicio: number
  diaFim: number
  orientacao: string
  fonte: string
}

export type DiaDePrevisao = {
  data: string
  condicao: Condicao
  minC: number
  maxC: number
  chuvaMm: number
  nivel: NivelDoDia
  frase: string
}

export type Enso = {
  fase: string
  intensidade: string
  indice: number
  mesPlantio: string
  frase: string
}

// GET /api/cultivos/{id}
export type DetalheDaLavoura = {
  id: number
  apelido: string
  cultura: string
  culturaId?: number
  areaHa: number | null
  municipio: string
  latitude: number
  longitude: number
  status: Cultivo['status']
  tipoCiclo: TipoCiclo
  dataPlantio: string
  colheitaPrevista: string
  diaAtual: number | null
  cicloDias: number | null
  safra: string | null
  // "A colheita vai de maio a agosto." nas perenes com safra.
  explicacaoCiclo?: string | null
  previsaoDisponivel: boolean
  previsaoAtualizadaEm: string
  enso: Enso | null
  fase?: FaseDoCiclo | null
  alertas: AlertaDaSemana[]
  previsao: DiaDePrevisao[]
}

export type AvisoDoHistorico = {
  tipo: string
  severidade: Severidade
  data: string
  mensagem: string
}

// GET /api/cultivos/{id}/alertas: 20 por página, do mais novo para o mais antigo.
export type PaginaDoHistorico = {
  itens: AvisoDoHistorico[]
  total: number
  pagina: number
  tamanho: number
}
