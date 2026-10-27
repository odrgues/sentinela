import { TileLayer } from 'react-leaflet'
import { SATELITE } from './mapa'

// A foto de satélite com os nomes das cidades por cima, a mesma no painel e ao marcar a lavoura.
export function CamadasDeSatelite() {
  return (
    <>
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
    </>
  )
}
