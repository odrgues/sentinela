import { APIProvider, AdvancedMarker, Map, useMap } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useTheme } from 'styled-components'
import { chaveDoGoogle, mapIdDoGoogle } from '../../../shared/mapa/chave'
import { NIVEL, NOME_DO_NIVEL, type NivelDoTema } from '../../../shared/ui/nivel'
import type { LavouraNoPainel } from '../tipos'
import * as S from './MapaDoPainel.styles'

const GOTA = 'M28 2 C 13 2 4 13 4 25 C 4 42 28 66 28 66 C 28 66 52 42 52 25 C 52 13 43 2 28 2 Z'
const ZOOM_DE_UMA_LAVOURA = 15
const FOLGA_EM_VOLTA = 56

function MarcadorDaLavoura({ apelido, nivel }: { apelido: string; nivel: NivelDoTema }) {
  const { cores, marcador } = useTheme()

  return (
    <S.Marcador>
      <S.Etiqueta>{apelido}</S.Etiqueta>
      <svg
        aria-hidden="true"
        width={marcador.larguraNoPainel}
        height={marcador.alturaNoPainel}
        viewBox="0 0 56 72"
      >
        <path
          d={GOTA}
          fill={cores.nivel[nivel].marcador}
          stroke={cores.texto.sobreDestaque}
          strokeWidth="4"
        />
        <circle cx="28" cy="25" r="9" fill={cores.texto.sobreDestaque} />
      </svg>
    </S.Marcador>
  )
}

// O mapa abre mostrando todas as lavouras.
function Enquadrar({ lavouras }: { lavouras: LavouraNoPainel[] }) {
  const mapa = useMap()

  useEffect(() => {
    if (!mapa || lavouras.length === 0) return
    if (lavouras.length === 1) {
      mapa.setCenter({ lat: lavouras[0].latitude, lng: lavouras[0].longitude })
      mapa.setZoom(ZOOM_DE_UMA_LAVOURA)
      return
    }
    const limites = new google.maps.LatLngBounds()
    for (const { latitude, longitude } of lavouras)
      limites.extend({ lat: latitude, lng: longitude })
    mapa.fitBounds(limites, FOLGA_EM_VOLTA)
  }, [mapa, lavouras])

  return null
}

export function Legenda() {
  return (
    <S.Legenda>
      <strong>Legenda</strong>
      {(['critico', 'atencao', 'ok'] as const).map((nivel) => (
        <S.ItemDaLegenda key={nivel} $nivel={nivel}>
          {NOME_DO_NIVEL[nivel]}
        </S.ItemDaLegenda>
      ))}
    </S.Legenda>
  )
}

// Mapa comum (não satélite), para os marcadores coloridos se destacarem. Tocar num marcador
// abre o detalhe da lavoura.
export function MapaDoPainel({ lavouras }: { lavouras: LavouraNoPainel[] }) {
  const navegar = useNavigate()
  const chave = chaveDoGoogle()

  if (!chave) {
    return (
      <S.Area>
        <S.SemMapa>
          <strong>Mapa desligado</strong>
          Falta a chave do Google Maps (VITE_GOOGLE_MAPS_KEY).
        </S.SemMapa>
      </S.Area>
    )
  }

  return (
    <APIProvider apiKey={chave} language="pt-BR" region="BR">
      <S.Area>
        <Map
          mapId={mapIdDoGoogle()}
          defaultCenter={{ lat: -14.235, lng: -51.9253 }}
          defaultZoom={4}
          disableDefaultUI
          zoomControl
          gestureHandling="greedy"
          style={{ position: 'absolute', inset: 0 }}
        >
          {lavouras.map((lavoura) => (
            <AdvancedMarker
              key={lavoura.id}
              position={{ lat: lavoura.latitude, lng: lavoura.longitude }}
              title={lavoura.apelido}
              onClick={() => navegar(`/lavouras/${lavoura.id}`)}
            >
              <MarcadorDaLavoura
                apelido={lavoura.apelido}
                nivel={NIVEL[lavoura.aviso.severidade]}
              />
            </AdvancedMarker>
          ))}
        </Map>
        <Enquadrar lavouras={lavouras} />
      </S.Area>
    </APIProvider>
  )
}
