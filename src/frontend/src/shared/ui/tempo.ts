import { Cloud, CloudLightning, CloudRain, CloudSun, Sun, type LucideIcon } from 'lucide-react'

// O código fixo que o backend tira do weather_code da Open-Meteo.
export type Condicao = 'sol' | 'sol_nuvens' | 'nublado' | 'chuva' | 'tempestade'

export const ICONE_DO_TEMPO: Record<Condicao, LucideIcon> = {
  sol: Sun,
  sol_nuvens: CloudSun,
  nublado: Cloud,
  chuva: CloudRain,
  tempestade: CloudLightning,
}

export const NOME_DO_TEMPO: Record<Condicao, string> = {
  sol: 'Sol',
  sol_nuvens: 'Sol com nuvens',
  nublado: 'Nublado',
  chuva: 'Chuva',
  tempestade: 'Tempestade',
}
