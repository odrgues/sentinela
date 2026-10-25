import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { useEffect, useState, type ReactNode } from 'react'
import type { Local, Ponto } from '../../tipos'
import { BuscaDeEndereco } from './BuscaDeEndereco'
import * as S from './Mapa.styles'
import { Marcador } from './Marcador'
import { MinhaLocalizacao } from './MinhaLocalizacao'
import { useLocalDoPonto } from './useLocalDoPonto'

const CENTRO_DO_BRASIL = { lat: -14.235, lng: -51.9253 }
const ZOOM_DO_BRASIL = 4
const ZOOM_DA_BUSCA = 14
const ZOOM_DO_GPS = 16
// Mais longe que isso, o marcador cobre uma região grande demais para ser uma lavoura.
const ZOOM_MINIMO_PARA_MARCAR = 13

type Camera = { ponto: Ponto; zoom: number }
type Destino = Ponto & { zoom: number }

// Move o mapa quando a pessoa escolhe uma busca ou usa o GPS.
function IrPara({ destino }: { destino: Destino | null }) {
  const mapa = useMap()

  useEffect(() => {
    if (!mapa || !destino) return
    mapa.panTo({ lat: destino.latitude, lng: destino.longitude })
    mapa.setZoom(destino.zoom)
  }, [mapa, destino])

  return null
}

type Props = {
  chave: string
  aoMudarLocal: (local: Local | null) => void
  topo?: ReactNode
  rodape?: ReactNode
  inicio?: Ponto
}

// O APIProvider carrega o Google; tudo que usa as bibliotecas dele (o Geocoder do
// useLocalDoPonto, a busca) precisa ficar dentro dele, no ConteudoDoMapa.
export function MapaDoGoogle({ chave, ...resto }: Props) {
  return (
    <APIProvider apiKey={chave} language="pt-BR" region="BR">
      <ConteudoDoMapa {...resto} />
    </APIProvider>
  )
}

function ConteudoDoMapa({ aoMudarLocal, topo, rodape, inicio }: Omit<Props, 'chave'>) {
  const [camera, setCamera] = useState<Camera | null>(null)
  const [destino, setDestino] = useState<Destino | null>(null)

  const pertoOSuficiente = camera !== null && camera.zoom >= ZOOM_MINIMO_PARA_MARCAR
  const local = useLocalDoPonto(pertoOSuficiente ? camera.ponto : null)

  useEffect(() => {
    aoMudarLocal(local ?? null)
  }, [local, aoMudarLocal])

  let instrucao = 'Arraste o mapa até o marcador ficar em cima da sua lavoura.'
  if (!pertoOSuficiente) instrucao = 'Busque a cidade ou aproxime o mapa até ver a sua lavoura.'
  else if (local === null) instrucao = 'Não achamos o município deste ponto. Mova um pouco o mapa.'

  return (
    <S.Area>
      <Map
        defaultCenter={inicio ? { lat: inicio.latitude, lng: inicio.longitude } : CENTRO_DO_BRASIL}
        defaultZoom={inicio ? ZOOM_DO_GPS : ZOOM_DO_BRASIL}
        mapTypeId="hybrid"
        disableDefaultUI
        zoomControl
        gestureHandling="greedy"
        style={{ position: 'absolute', inset: 0 }}
        onIdle={({ map }) => {
          const centro = map.getCenter()
          if (!centro) return
          setCamera({
            ponto: { latitude: centro.lat(), longitude: centro.lng() },
            zoom: map.getZoom() ?? 0,
          })
        }}
      />
      <IrPara destino={destino} />
      <S.CartaoDeCima>
        {topo}
        <BuscaDeEndereco aoEscolher={(ponto) => setDestino({ ...ponto, zoom: ZOOM_DA_BUSCA })} />
      </S.CartaoDeCima>
      <Marcador />
      <S.CartaoDeBaixo>
        <S.Instrucao>{instrucao}</S.Instrucao>
        <MinhaLocalizacao aoAchar={(ponto) => setDestino({ ...ponto, zoom: ZOOM_DO_GPS })} />
        {rodape}
      </S.CartaoDeBaixo>
    </S.Area>
  )
}
