// A cana tem regra própria de colheita, por isso não é nem anual nem perene.
// Na contínua (morango, chuchu), a colheita começa no meio do ciclo e vai até o fim.
export type TipoCiclo = 'anual' | 'perene' | 'cana' | 'continua'

export type Cultura = {
  id: number
  nome: string
  cicloDias: number
  tipoCiclo: TipoCiclo
  // A linha embaixo do nome na lista, já pronta: "Ciclo de 120 dias", "Perene · colheita de maio a agosto".
  descricaoCiclo?: string
}
