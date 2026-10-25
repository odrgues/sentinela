// A cana tem regra própria de colheita, por isso não é nem anual nem perene.
export type TipoCiclo = 'anual' | 'perene' | 'cana'

export type Cultura = {
  id: number
  nome: string
  cicloDias: number
  tipoCiclo: TipoCiclo
}
