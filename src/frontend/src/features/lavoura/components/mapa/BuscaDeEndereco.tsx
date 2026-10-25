import { useMapsLibrary } from '@vis.gl/react-google-maps'
import { Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'styled-components'
import { SoParaLeitor } from '../../../../shared/ui/SoParaLeitor'
import type { Ponto } from '../../tipos'
import * as S from './BuscaDeEndereco.styles'

const ESPERA_AO_DIGITAR = 300
const MINIMO_DE_LETRAS = 3

type Sugestao = google.maps.places.PlacePrediction

// "Buscar cidade ou endereço", pelo Autocomplete do Places (a API nova). Escolher uma
// sugestão leva o mapa até lá; quem marca a lavoura continua sendo o marcador do meio.
export function BuscaDeEndereco({ aoEscolher }: { aoEscolher: (ponto: Ponto) => void }) {
  const tema = useTheme()
  const id = useId()
  const places = useMapsLibrary('places')
  const [texto, setTexto] = useState('')
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([])
  // O texto da sugestão escolhida: com ele no campo, a lista não abre de novo.
  const [escolhido, setEscolhido] = useState<string | null>(null)
  // Uma sessão vai das letras digitadas até a escolha: o Google cobra as duas juntas.
  const sessao = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  const buscando = texto.trim().length >= MINIMO_DE_LETRAS && texto !== escolhido

  useEffect(() => {
    if (!places || !buscando) return
    let valendo = true
    const relogio = setTimeout(async () => {
      sessao.current ??= new places.AutocompleteSessionToken()
      try {
        const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: texto,
          sessionToken: sessao.current,
          includedRegionCodes: ['br'],
          language: 'pt-BR',
        })
        if (valendo) {
          setSugestoes(suggestions.flatMap(({ placePrediction }) => placePrediction ?? []))
        }
      } catch {
        if (valendo) setSugestoes([])
      }
    }, ESPERA_AO_DIGITAR)
    return () => {
      valendo = false
      clearTimeout(relogio)
    }
  }, [places, texto, buscando])

  async function escolher(sugestao: Sugestao) {
    setTexto(sugestao.text.text)
    setEscolhido(sugestao.text.text)
    setSugestoes([])
    const lugar = sugestao.toPlace()
    await lugar.fetchFields({ fields: ['location'] })
    sessao.current = null
    if (lugar.location) {
      aoEscolher({ latitude: lugar.location.lat(), longitude: lugar.location.lng() })
    }
  }

  return (
    <>
      <S.Busca>
        <SoParaLeitor as="label" htmlFor={id}>
          Buscar cidade ou endereço
        </SoParaLeitor>
        <Search size={tema.icone.busca} aria-hidden />
        <S.Entrada
          id={id}
          type="search"
          placeholder="Buscar cidade ou endereço"
          autoComplete="off"
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
        />
      </S.Busca>
      {buscando && sugestoes.length > 0 && (
        <S.Sugestoes aria-label="Sugestões">
          {sugestoes.map((sugestao) => (
            <li key={sugestao.placeId}>
              <S.Sugestao type="button" onClick={() => escolher(sugestao)}>
                {sugestao.text.text}
              </S.Sugestao>
            </li>
          ))}
        </S.Sugestoes>
      )}
    </>
  )
}
