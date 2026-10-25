import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react'
import type { Local, Ponto } from '../../tipos'
import { cidadeEUf } from './cidadeEUf'

type Resposta = { chave: string; local: Local | null }

function chaveDo(ponto: Ponto) {
  return `${ponto.latitude},${ponto.longitude}`
}

// Pergunta ao Geocoder em que município fica o ponto. Devolve undefined enquanto procura, e
// null quando o ponto não tem município no Brasil (no mar, ou fora do país).
export function useLocalDoPonto(ponto: Ponto | null): Local | null | undefined {
  const geocoding = useMapsLibrary('geocoding')
  const [resposta, setResposta] = useState<Resposta | null>(null)

  useEffect(() => {
    if (!geocoding || !ponto) return
    let valendo = true
    new geocoding.Geocoder()
      .geocode({ location: { lat: ponto.latitude, lng: ponto.longitude } })
      .then(({ results }) => {
        const achado = cidadeEUf(results)
        if (valendo)
          setResposta({ chave: chaveDo(ponto), local: achado && { ...ponto, ...achado } })
      })
      .catch(() => {
        if (valendo) setResposta({ chave: chaveDo(ponto), local: null })
      })
    return () => {
      valendo = false
    }
  }, [geocoding, ponto])

  if (!ponto) return null
  return resposta?.chave === chaveDo(ponto) ? resposta.local : undefined
}
