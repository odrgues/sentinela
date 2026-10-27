// O endereço que o Nominatim devolve para um ponto. O município vem com um nome diferente
// conforme o tamanho do lugar, e a UF vem no código do estado, como 'BR-MG'.
export type EnderecoDoNominatim = {
  municipality?: string
  city?: string
  town?: string
  village?: string
  country_code?: string
  'ISO3166-2-lvl4'?: string
}

// Fora do Brasil não vale: o backend precisa de uma UF.
export function cidadeEUf(
  endereco: EnderecoDoNominatim | undefined,
): { cidade: string; uf: string } | null {
  if (endereco?.country_code !== 'br') return null
  const cidade = endereco.municipality ?? endereco.city ?? endereco.town ?? endereco.village
  const uf = endereco['ISO3166-2-lvl4']?.replace('BR-', '')
  return cidade && uf ? { cidade, uf } : null
}
