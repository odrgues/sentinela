import { useTheme } from 'styled-components'

// Os talhões vistos de cima, atrás da faixa verde. Só enfeite.
const TALHOES = [
  'M-20 120 L260 80 L320 300 L-20 340 Z',
  'M320 300 L260 80 L560 40 L640 260 Z',
  'M640 260 L560 40 L820 0 L820 240 Z',
  'M-20 340 L320 300 L360 560 L-20 600 Z',
  'M320 300 L640 260 L700 520 L360 560 Z',
  'M640 260 L820 240 L820 500 L700 520 Z',
  'M-20 600 L360 560 L400 920 L-20 920 Z',
  'M360 560 L700 520 L760 920 L400 920 Z',
]

const DIVISAS =
  'M-20 120 L260 80 L560 40 L820 0 M320 300 L360 560 L400 920 M640 260 L700 520 L760 920'
const ESTRADA = 'M-20 470 C 180 430, 330 620, 500 480 S 760 380, 820 420'
const MARCADOR =
  'M0 -40 C -22 -40 -34 -24 -34 -8 C -34 16 0 44 0 44 C 0 44 34 16 34 -8 C 34 -24 22 -40 0 -40 Z'

export function PadraoDeLavoura({ comMarcador = false }: { comMarcador?: boolean }) {
  const { cores } = useTheme()
  const { talhoes } = cores.marca

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 900"
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0 }}
    >
      {TALHOES.map((caminho, i) => (
        <path key={caminho} d={caminho} fill={talhoes[i % talhoes.length]} />
      ))}
      <path d={DIVISAS} fill="none" stroke={cores.marca.divisa} strokeWidth="2" />
      <path
        d={ESTRADA}
        fill="none"
        stroke={cores.marca.estrada}
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.5"
      />
      {comMarcador && (
        <g transform="translate(520 170)">
          <path d={MARCADOR} fill={cores.marca.sol} />
          <circle cx="0" cy="-8" r="12" fill={cores.destaque.base} />
        </g>
      )}
    </svg>
  )
}
