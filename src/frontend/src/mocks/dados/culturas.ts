import type { Cultura } from '../../shared/api/tipos/cultura'

// O GET /api/culturas da especificação da API (12/10): as 9 culturas, em ordem alfabética.
export const culturas: Cultura[] = [
  { id: 4, nome: 'Algodão', cicloDias: 180, tipoCiclo: 'anual' },
  { id: 9, nome: 'Arroz', cicloDias: 110, tipoCiclo: 'anual' },
  { id: 5, nome: 'Café', cicloDias: 365, tipoCiclo: 'perene' },
  { id: 6, nome: 'Cana-de-açúcar', cicloDias: 365, tipoCiclo: 'cana' },
  { id: 1, nome: 'Feijão', cicloDias: 90, tipoCiclo: 'anual' },
  { id: 2, nome: 'Milho', cicloDias: 120, tipoCiclo: 'anual' },
  { id: 3, nome: 'Soja', cicloDias: 120, tipoCiclo: 'anual' },
  { id: 7, nome: 'Sorgo', cicloDias: 100, tipoCiclo: 'anual' },
  { id: 8, nome: 'Trigo', cicloDias: 110, tipoCiclo: 'anual' },
]
