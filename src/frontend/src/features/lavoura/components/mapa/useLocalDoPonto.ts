import { useEffect, useState } from 'react'
import type { Local, Ponto } from '../../tipos'
import { cidadeEUf } from './cidadeEUf'

// O Nominatim (do OpenStreetMap) aceita no máximo um pedido por segundo: só pergunta depois que o
// mapa fica um pouco parado.
const ESPERA_DO_MAPA_PARADO = 500

type Resposta = { chave: string; local: Local | null }

function chaveDo(ponto: Ponto) {
  return `${ponto.latitude},${ponto.longitude}`
}

function enderecoDoNominatim(ponto: Ponto) {
  const parametros = new URLSearchParams({
    format: 'jsonv2',
    lat: String(ponto.latitude),
    lon: String(ponto.longitude),
    // 10 é o nível da cidade: a resposta vem com o município, não com a rua.
    zoom: '10',
    addressdetails: '1',
    'accept-language': 'pt-BR',
  })
  return `https://nominatim.openstreetmap.org/reverse?${parametros}`
}

// Pergunta ao Nominatim em que município fica o ponto. Devolve undefined enquanto procura, e
// null quando o ponto não tem município no Brasil (no mar, ou fora do país).
export function useLocalDoPonto(ponto: Ponto | null): Local | null | undefined {
  const [resposta, setResposta] = useState<Resposta | null>(null)

  useEffect(() => {
    if (!ponto) return
    const controle = new AbortController()
    const relogio = setTimeout(async () => {
      try {
        const resultado = await fetch(enderecoDoNominatim(ponto), { signal: controle.signal })
        const { address } = await resultado.json()
        const achado = cidadeEUf(address)
        setResposta({ chave: chaveDo(ponto), local: achado && { ...ponto, ...achado } })
      } catch {
        if (!controle.signal.aborted) setResposta({ chave: chaveDo(ponto), local: null })
      }
    }, ESPERA_DO_MAPA_PARADO)
    return () => {
      clearTimeout(relogio)
      controle.abort()
    }
  }, [ponto])

  if (!ponto) return null
  return resposta?.chave === chaveDo(ponto) ? resposta.local : undefined
}
