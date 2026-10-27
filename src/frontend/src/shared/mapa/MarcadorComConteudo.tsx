import { divIcon } from 'leaflet'
import { useMemo, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Marker } from 'react-leaflet'

type Props = {
  latitude: number
  longitude: number
  titulo: string
  aoTocar: () => void
  children: ReactNode
}

// Um marcador do Leaflet com conteúdo do React dentro. O Leaflet só aceita HTML pronto, então o
// conteúdo vai por um portal para a div que ele coloca no mapa. A div não tem tamanho: quem
// posiciona o desenho em cima do ponto é o próprio conteúdo.
export function MarcadorComConteudo({ latitude, longitude, titulo, aoTocar, children }: Props) {
  const [elemento] = useState(() => document.createElement('div'))
  const icone = useMemo(
    () => divIcon({ html: elemento, className: '', iconSize: [0, 0] }),
    [elemento],
  )

  return (
    <>
      <Marker
        position={[latitude, longitude]}
        icon={icone}
        title={titulo}
        eventHandlers={{ click: aoTocar }}
      />
      {createPortal(children, elemento)}
    </>
  )
}
