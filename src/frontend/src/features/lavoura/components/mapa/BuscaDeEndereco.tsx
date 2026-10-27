import { Search } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { useTheme } from 'styled-components'
import { SoParaLeitor } from '../../../../shared/ui/SoParaLeitor'
import type { Ponto } from '../../tipos'
import * as S from './BuscaDeEndereco.styles'

const ESPERA_AO_DIGITAR = 300
const MINIMO_DE_LETRAS = 3

// O Brasil inteiro (oeste, sul, leste, norte), para a busca não sugerir lugares de fora.
const CAIXA_DO_BRASIL = '-74,-34,-34,6'

type Sugestao = { id: string; texto: string; ponto: Ponto }

type LugarDoPhoton = {
  geometry: { coordinates: [number, number] }
  properties: {
    osm_id: number
    name?: string
    street?: string
    city?: string
    county?: string
    state?: string
    countrycode?: string
  }
}

// "Avenida Leopoldino de Oliveira, Uberaba, Minas Gerais", sem repetir o nome quando o lugar
// já é a cidade.
function textoDo({ properties: lugar }: LugarDoPhoton) {
  const partes = [lugar.name ?? lugar.street, lugar.city ?? lugar.county, lugar.state]
  return [...new Set(partes.filter(Boolean))].join(', ')
}

async function buscarNoPhoton(texto: string, sinal: AbortSignal): Promise<Sugestao[]> {
  const parametros = new URLSearchParams({ q: texto, limit: '5', bbox: CAIXA_DO_BRASIL })
  const resultado = await fetch(`https://photon.komoot.io/api/?${parametros}`, { signal: sinal })
  const { features } = (await resultado.json()) as { features: LugarDoPhoton[] }
  return features
    .filter((lugar) => lugar.properties.countrycode === 'BR')
    .map((lugar, posicao) => ({
      id: `${lugar.properties.osm_id}-${posicao}`,
      texto: textoDo(lugar),
      ponto: { latitude: lugar.geometry.coordinates[1], longitude: lugar.geometry.coordinates[0] },
    }))
}

// "Buscar cidade ou endereço", pelo Photon (dados do OpenStreetMap). Escolher uma sugestão leva
// o mapa até lá; quem marca a lavoura continua sendo o marcador do meio.
export function BuscaDeEndereco({ aoEscolher }: { aoEscolher: (ponto: Ponto) => void }) {
  const tema = useTheme()
  const id = useId()
  const [texto, setTexto] = useState('')
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([])
  // O texto da sugestão escolhida: com ele no campo, a lista não abre de novo.
  const [escolhido, setEscolhido] = useState<string | null>(null)

  const buscando = texto.trim().length >= MINIMO_DE_LETRAS && texto !== escolhido

  useEffect(() => {
    if (!buscando) return
    const controle = new AbortController()
    const relogio = setTimeout(async () => {
      try {
        setSugestoes(await buscarNoPhoton(texto, controle.signal))
      } catch {
        if (!controle.signal.aborted) setSugestoes([])
      }
    }, ESPERA_AO_DIGITAR)
    return () => {
      clearTimeout(relogio)
      controle.abort()
    }
  }, [texto, buscando])

  function escolher(sugestao: Sugestao) {
    setTexto(sugestao.texto)
    setEscolhido(sugestao.texto)
    setSugestoes([])
    aoEscolher(sugestao.ponto)
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
            <li key={sugestao.id}>
              <S.Sugestao type="button" onClick={() => escolher(sugestao)}>
                {sugestao.texto}
              </S.Sugestao>
            </li>
          ))}
        </S.Sugestoes>
      )}
    </>
  )
}
