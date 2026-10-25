import { useTheme } from 'styled-components'
import * as S from './Mapa.styles'

const GOTA = 'M28 2 C 13 2 4 13 4 25 C 4 42 28 66 28 66 C 28 66 52 42 52 25 C 52 13 43 2 28 2 Z'

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
        <path
          d={GOTA}
          fill={cores.destaque.base}
          stroke={cores.texto.sobreDestaque}
          strokeWidth="3"
        />
        <circle cx="28" cy="25" r="9" fill={cores.marca.sol} />
      </svg>
    </S.Marcador>
  )
}
