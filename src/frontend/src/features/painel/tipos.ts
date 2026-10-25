import type { TipoCiclo } from '../../shared/api/tipos/cultura'
import type { Condicao } from '../../shared/ui/tempo'
import type { Severidade } from '../../shared/ui/nivel'

export type Aviso = {
  tipo: string
  severidade: Severidade
  mensagem: string
}

export type LavouraNoPainel = {
  id: number
  apelido: string
  cultura: string
  tipoCiclo?: TipoCiclo
  // null nas perenes, que mostram a safra no lugar do dia.
  diaAtual: number | null
  cicloDias: number | null
  safra?: string | null
  latitude: number
  longitude: number
  // O nome da fase do ciclo ("Floração"), quando a cultura tem fases cadastradas.
  fase?: string | null
  aviso: Aviso
}

export type Painel = {
  usuario: { nome: string }
  hoje: {
    cidade: string
    uf: string
    // Nulo quando a previsão de hoje não chegou.
    tempC: number | null
    condicao: Condicao
    condicaoTexto: string
  }
  frase: string
  previsaoDisponivel: boolean
  previsaoAtualizadaEm: string
  cultivos: LavouraNoPainel[]
}
