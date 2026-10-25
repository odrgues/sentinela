import type { Cultura } from '../../shared/api/tipos/cultura'

// A linha embaixo do nome de cada cultura, na lista de "O que você plantou?".
export function descricaoDoCiclo(cultura: Cultura) {
  if (cultura.tipoCiclo === 'perene') return 'Perene · colheita de maio a agosto'
  if (cultura.tipoCiclo === 'cana') return 'Ciclo de 12 ou 18 meses'
  return `Ciclo de ${cultura.cicloDias} dias`
}

// Sem acento e em minúsculas, para "cafe" achar o "Café".
export function paraBusca(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}
