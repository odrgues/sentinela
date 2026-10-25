import { Check, CircleAlert, TriangleAlert, type LucideIcon } from 'lucide-react'

// O nível de um aviso, como a API manda. "info" é a semana sem risco: "Tudo certo".
export type Severidade = 'critico' | 'atencao' | 'info'

// A API diz "info" para a semana sem risco; o tema chama essa cor de "ok".
export type NivelDoTema = 'critico' | 'atencao' | 'ok'

export const NIVEL: Record<Severidade, NivelDoTema> = {
  critico: 'critico',
  atencao: 'atencao',
  info: 'ok',
}

export const ICONE_DO_NIVEL: Record<NivelDoTema, LucideIcon> = {
  critico: TriangleAlert,
  atencao: CircleAlert,
  ok: Check,
}

export const NOME_DO_NIVEL: Record<NivelDoTema, string> = {
  critico: 'Crítico',
  atencao: 'Atenção',
  ok: 'Tudo certo',
}
