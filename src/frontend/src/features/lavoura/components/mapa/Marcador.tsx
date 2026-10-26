import { useTheme } from 'styled-components'
import { GOTA_VAZADA } from '../../../../shared/mapa/gota'
import * as S from './Mapa.styles'

// O marcador fica parado no meio; quem se mexe é o mapa embaixo dele.
export function Marcador() {
  const { cores, marcador } = useTheme()

  return (
    <S.Marcador>
      <svg
        role="img"
        aria-label="Marcador da lavoura"
        width={marcador.largura}
        height={marcador.altura}
        viewBox="0 0 56 72"
      >
        <ellipse cx="28" cy="68" rx="10" ry="3.5" fill={cores.texto.principal} opacity="0.25" />
        <path d={GOTA_VAZADA} fillRule="evenodd" fill={cores.marca.alfinete} />
      </svg>
    </S.Marcador>
  )
}
