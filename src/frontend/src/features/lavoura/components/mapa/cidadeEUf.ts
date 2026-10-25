type Parte = { long_name: string; short_name: string; types: string[] }
type Resultado = { address_components: Parte[] }

function parte(resultado: Resultado, tipo: string) {
  return resultado.address_components.find((componente) => componente.types.includes(tipo))
}

// O Geocoder devolve vários endereços para o ponto, do mais exato ao mais geral. O município é
// o administrative_area_level_2 e a UF é o short_name do administrative_area_level_1.
// Fora do Brasil não vale: o backend precisa de uma UF.
export function cidadeEUf(resultados: Resultado[]): { cidade: string; uf: string } | null {
  for (const resultado of resultados) {
    const pais = parte(resultado, 'country')?.short_name
    const cidade = parte(resultado, 'administrative_area_level_2')?.long_name
    const uf = parte(resultado, 'administrative_area_level_1')?.short_name
    if (pais === 'BR' && cidade && uf) return { cidade, uf }
  }
  return null
}
