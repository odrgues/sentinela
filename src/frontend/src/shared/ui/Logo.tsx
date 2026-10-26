import { useTheme } from 'styled-components'
import * as S from './Logo.styles'

// O logo do Sentinela: o nome e, à direita dele, a plantinha saindo da terra.
// Animado, o nome entra suave e, no fim, a planta cresce: a terra, o caule, as folhas e o broto.
// Com "reduzir movimento" ligado no sistema, aparece pronto. Pequeno, é o da barra do topo.
// Claro, é branco, para ficar em cima do verde.
export function Logo({
  animado = true,
  pequeno = false,
  claro = false,
}: {
  animado?: boolean
  pequeno?: boolean
  claro?: boolean
}) {
  const tema = useTheme()
  const planta = claro ? tema.cores.plantaClara : tema.cores.planta
  const tamanho = pequeno ? tema.icone.logoPequeno : tema.icone.logo

  return (
    <S.Logo $animado={animado} $pequeno={pequeno} $claro={claro}>
      <S.Nome>Sentinela</S.Nome>
      {/* O desenho é de 120 por 120; o viewBox corta a sobra em volta da planta. */}
      <S.Desenho viewBox="12 10 96 96" width={tamanho} height={tamanho} aria-hidden>
        <S.Terra d="M14 106 C 30 94, 46 90, 60 90 C 76 90, 92 95, 106 106 Z" fill={planta.terra} />
        <S.Caule
          d="M60 92 C 57 80, 66 70, 61 58 C 57 48, 63 38, 60 28"
          pathLength={1}
          fill="none"
          stroke={planta.caule}
          strokeWidth={tema.tracoDoIcone.caule}
          strokeLinecap="round"
        />
        <S.FolhaDaEsquerda>
          <path d="M60 43 C 52 33, 36 31, 24 36 C 34 47, 50 49, 60 43 Z" fill={planta.folha} />
          <path
            d="M57 42 C 49 38, 39 36, 30 37"
            fill="none"
            stroke={planta.nervura}
            strokeWidth={tema.tracoDoIcone.normal / 2}
            strokeLinecap="round"
          />
        </S.FolhaDaEsquerda>
        <S.FolhaDaDireita>
          <path d="M60 43 C 70 35, 86 35, 98 41 C 87 51, 70 51, 60 43 Z" fill={planta.folha} />
          <path
            d="M63 43 C 72 40, 82 40, 91 42"
            fill="none"
            stroke={planta.nervura}
            strokeWidth={tema.tracoDoIcone.normal / 2}
            strokeLinecap="round"
          />
        </S.FolhaDaDireita>
        <S.Broto>
          <path d="M60 28 C 56 22, 53 17, 54 13 C 59 16, 61 22, 60 28 Z" fill={planta.broto} />
          <path d="M60 28 C 63 22, 67 18, 71 17 C 69 22, 65 26, 60 28 Z" fill={planta.broto} />
        </S.Broto>
      </S.Desenho>
    </S.Logo>
  )
}
