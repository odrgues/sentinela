import { latLngBounds } from 'leaflet'
import { useEffect, useState } from 'react'
import { AttributionControl, MapContainer, ZoomControl, useMap, useMapEvents } from 'react-leaflet'
import { useNavigate } from 'react-router'
import { useTheme } from 'styled-components'
import { GOTA_VAZADA } from '../../../shared/mapa/gota'
import { MarcadorComConteudo } from '../../../shared/mapa/MarcadorComConteudo'
import { CamadasDeSatelite } from '../../../shared/mapa/CamadasDeSatelite'
import { CENTRO_DO_BRASIL, SATELITE, ZOOM_DO_BRASIL, mapaLigado } from '../../../shared/mapa/mapa'
import { NIVEL, NOME_DO_NIVEL, type NivelDoTema } from '../../../shared/ui/nivel'
import type { LavouraNoPainel } from '../tipos'
import { etiquetasVisiveis } from './etiquetas'
import * as S from './MapaDoPainel.styles'

const ZOOM_DE_UMA_LAVOURA = 15
const FOLGA_EM_VOLTA = 56

const PRIORIDADE: Record<NivelDoTema, number> = { critico: 0, atencao: 1, ok: 2 }

function MarcadorDaLavoura({
  apelido,
  nivel,
  comEtiqueta,
}: {
  apelido: string
  nivel: NivelDoTema
  comEtiqueta: boolean
}) {
  const { cores, marcador } = useTheme()

  return (
    <S.Marcador>
      <S.Etiqueta $escondida={!comEtiqueta}>{apelido}</S.Etiqueta>
      <svg aria-hidden="true" width={marcador.largura} height={marcador.altura} viewBox="0 0 56 72">
        {/* Igual ao marcador de marcar a lavoura, na cor do nível de aviso. */}
        <path d={GOTA_VAZADA} fillRule="evenodd" fill={cores.nivel[nivel].marcador} />
      </svg>
    </S.Marcador>
  )
}

// O mapa abre mostrando todas as lavouras, fora do que estiver por cima dele à esquerda e no alto.
function Enquadrar({
  lavouras,
  folgaAEsquerda,
  folgaEmCima,
}: {
  lavouras: LavouraNoPainel[]
  folgaAEsquerda: number
  folgaEmCima: number
}) {
  const mapa = useMap()

  useEffect(() => {
    if (lavouras.length === 0) return
    if (lavouras.length === 1) {
      mapa.setView([lavouras[0].latitude, lavouras[0].longitude], ZOOM_DE_UMA_LAVOURA)
      return
    }
    const limites = latLngBounds(lavouras.map(({ latitude, longitude }) => [latitude, longitude]))
    mapa.fitBounds(limites, {
      paddingTopLeft: [FOLGA_EM_VOLTA + folgaAEsquerda, FOLGA_EM_VOLTA + folgaEmCima],
      paddingBottomRight: [FOLGA_EM_VOLTA, FOLGA_EM_VOLTA],
    })
  }, [mapa, lavouras, folgaAEsquerda, folgaEmCima])

  return null
}

// Calcula quais nomes cabem no mapa agora, e de novo sempre que o mapa muda de zoom ou de lugar.
function EtiquetasSemSobreposicao({
  lavouras,
  aoCalcular,
}: {
  lavouras: LavouraNoPainel[]
  aoCalcular: (visiveis: Set<number>) => void
}) {
  const { marcador } = useTheme()
  const mapa = useMap()

  const calcular = () => {
    const pontos = lavouras.map((lavoura) => {
      const naTela = mapa.latLngToContainerPoint([lavoura.latitude, lavoura.longitude])
      return {
        id: lavoura.id,
        x: naTela.x,
        y: naTela.y,
        prioridade: PRIORIDADE[NIVEL[lavoura.aviso.severidade]],
        apelido: lavoura.apelido,
      }
    })
    aoCalcular(etiquetasVisiveis(pontos, marcador))
  }

  useMapEvents({ zoomend: calcular, moveend: calcular, resize: calcular })
  useEffect(calcular, [lavouras]) // eslint-disable-line react-hooks/exhaustive-deps

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

// O mesmo satélite da nova lavoura, com um marcador colorido por lavoura. Tocar num marcador
// abre o detalhe da lavoura. As folgas são o tamanho do que flutua por cima do mapa.
export function MapaDoPainel({
  lavouras,
  folgaAEsquerda = 0,
  folgaEmCima = 0,
}: {
  lavouras: LavouraNoPainel[]
  folgaAEsquerda?: number
  folgaEmCima?: number
}) {
  const navegar = useNavigate()
  // Antes de o mapa calcular, todos os nomes aparecem.
  const [comEtiqueta, setComEtiqueta] = useState<Set<number> | null>(null)

  if (!mapaLigado()) {
    return (
      <S.Area>
        <S.SemMapa>
          <strong>Mapa desligado</strong>
        </S.SemMapa>
      </S.Area>
    )
  }

  return (
    <S.Area>
      <MapContainer
        center={CENTRO_DO_BRASIL}
        zoom={ZOOM_DO_BRASIL}
        maxZoom={SATELITE.zoomMaximo}
        zoomControl={false}
        attributionControl={false}
      >
        <CamadasDeSatelite />
        <ZoomControl position="bottomright" />
        <AttributionControl position="bottomright" prefix={false} />
        {lavouras.map((lavoura) => (
          <MarcadorComConteudo
            key={lavoura.id}
            latitude={lavoura.latitude}
            longitude={lavoura.longitude}
            titulo={lavoura.apelido}
            aoTocar={() => navegar(`/lavouras/${lavoura.id}`)}
          >
            <MarcadorDaLavoura
              apelido={lavoura.apelido}
              nivel={NIVEL[lavoura.aviso.severidade]}
              comEtiqueta={comEtiqueta === null || comEtiqueta.has(lavoura.id)}
            />
          </MarcadorComConteudo>
        ))}
        <Enquadrar lavouras={lavouras} folgaAEsquerda={folgaAEsquerda} folgaEmCima={folgaEmCima} />
        <EtiquetasSemSobreposicao lavouras={lavouras} aoCalcular={setComEtiqueta} />
      </MapContainer>
    </S.Area>
  )
}
