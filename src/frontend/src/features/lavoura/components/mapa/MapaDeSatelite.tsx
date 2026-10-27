import type { Map as MapaDoLeaflet } from 'leaflet'
import { useEffect, useState, type ReactNode } from 'react'
import {
  AttributionControl,
  MapContainer,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { CENTRO_DO_BRASIL, SATELITE, ZOOM_DO_BRASIL } from '../../../../shared/mapa/mapa'
import type { Local, Ponto } from '../../tipos'
import { BuscaDeEndereco } from './BuscaDeEndereco'
import * as S from './Mapa.styles'
import { Marcador } from './Marcador'
import { MinhaLocalizacao } from './MinhaLocalizacao'
import { useLocalDoPonto } from './useLocalDoPonto'

const ZOOM_DA_BUSCA = 14
const ZOOM_DO_GPS = 16
// Mais longe que isso, o marcador cobre uma região grande demais para ser uma lavoura.
const ZOOM_MINIMO_PARA_MARCAR = 13

type Camera = { ponto: Ponto; zoom: number }
type Destino = Ponto & { zoom: number }

function cameraDo(mapa: MapaDoLeaflet): Camera {
  const centro = mapa.getCenter()
  return { ponto: { latitude: centro.lat, longitude: centro.lng }, zoom: mapa.getZoom() }
}

// Avisa onde o mapa está quando ele abre e sempre que para de se mexer.
function AoParar({ aoParar }: { aoParar: (camera: Camera) => void }) {
  const mapa = useMapEvents({ moveend: () => aoParar(cameraDo(mapa)) })

  useEffect(() => {
    aoParar(cameraDo(mapa))
  }, [mapa, aoParar])

  return null
}

// Move o mapa quando a pessoa escolhe uma busca ou usa o GPS.
function IrPara({ destino }: { destino: Destino | null }) {
  const mapa = useMap()

  useEffect(() => {
    if (!destino) return
    mapa.setView([destino.latitude, destino.longitude], destino.zoom)
  }, [mapa, destino])

  return null
}

type Props = {
  aoMudarLocal: (local: Local | null) => void
  topo?: ReactNode
  rodape?: ReactNode
  inicio?: Ponto
  telaCheia?: boolean
}

export function MapaDeSatelite({ aoMudarLocal, topo, rodape, inicio, telaCheia = false }: Props) {
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
    <S.Area $telaCheia={telaCheia}>
      <MapContainer
        center={inicio ? [inicio.latitude, inicio.longitude] : CENTRO_DO_BRASIL}
        zoom={inicio ? ZOOM_DO_GPS : ZOOM_DO_BRASIL}
        maxZoom={SATELITE.zoomMaximo}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url={SATELITE.url}
          attribution={SATELITE.creditos}
          maxNativeZoom={SATELITE.zoomDaFoto}
          maxZoom={SATELITE.zoomMaximo}
        />
        <TileLayer
          url={SATELITE.nomes}
          maxNativeZoom={SATELITE.zoomDaFoto}
          maxZoom={SATELITE.zoomMaximo}
        />
        <ZoomControl position="bottomright" />
        <AttributionControl position="bottomright" prefix={false} />
        <AoParar aoParar={setCamera} />
        <IrPara destino={destino} />
      </MapContainer>
      <S.CartaoDeCima $telaCheia={telaCheia}>
        {topo}
        <BuscaDeEndereco aoEscolher={(ponto) => setDestino({ ...ponto, zoom: ZOOM_DA_BUSCA })} />
      </S.CartaoDeCima>
      <Marcador />
      <S.CartaoDeBaixo $telaCheia={telaCheia}>
        <S.Instrucao>{instrucao}</S.Instrucao>
        <MinhaLocalizacao aoAchar={(ponto) => setDestino({ ...ponto, zoom: ZOOM_DO_GPS })} />
        {rodape}
      </S.CartaoDeBaixo>
    </S.Area>
  )
}
