import styled, { css, keyframes } from 'styled-components'

// A ordem da animação, em milissegundos, contando de quando a página abre: a página entra
// (TelaDividida.styles.ts), o nome aparece logo depois e, no fim, a planta cresce.
const ENTRADA = { atraso: 300, duracao: 700 }
const TERRA = { atraso: 1000, duracao: 400 }
const CAULE = { atraso: 1300, duracao: 800 }
const FOLHAS = { atraso: 2000, duracao: 550 }
const BROTO = { atraso: 2450, duracao: 400 }

// Sobe um pouco enquanto aparece (8% da altura do próprio logo).
const surgir = keyframes`
  from {
    opacity: 0;
    transform: translateY(8%);
  }
`

const aparecerDeBaixo = keyframes`
  from {
    opacity: 0;
    transform: scaleY(0);
  }
`

// O caule começa invisível: a ponta arredondada do traço vazio ainda deixaria um pontinho.
const desenharOCaule = keyframes`
  from {
    stroke-dashoffset: 1;
    opacity: 0;
  }

  5% {
    opacity: 1;
  }
`

const abrir = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }
`

// Cada parte começa escondida (fill-mode both) e termina no desenho pronto, que é o estilo normal.
function animar(
  nome: ReturnType<typeof keyframes>,
  { atraso, duracao }: { atraso: number; duracao: number },
  curva = 'ease-out',
) {
  return css`
    animation: ${nome} ${duracao}ms ${curva} ${atraso}ms both;
  `
}

export const Desenho = styled.svg`
  overflow: visible;
`

export const Terra = styled.path`
  transform-box: fill-box;
  transform-origin: 50% 100%;
`

// O traço tem o tamanho do caule (pathLength 1) e um vão maior que ele, para não repetir.
export const Caule = styled.path`
  stroke-dasharray: 1 2;
  stroke-dashoffset: 0;
`

// As folhas abrem a partir do ponto em que encostam no caule.
export const FolhaDaEsquerda = styled.g`
  transform-box: fill-box;
  transform-origin: 100% 67%;
`

export const FolhaDaDireita = styled.g`
  transform-box: fill-box;
  transform-origin: 0% 50%;
`

export const Broto = styled.g`
  transform-box: fill-box;
  transform-origin: 50% 100%;
`

export const Nome = styled.span`
  font-family: ${({ theme }) => theme.fonte.familiaDoLogo};
  font-size: ${({ theme }) => theme.fonte.tamanho.logo};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
  color: ${({ theme }) => theme.cores.destaque.base};
`

export const Logo = styled.div<{ $animado: boolean; $pequeno: boolean; $claro: boolean }>`
  display: flex;
  /* A terra fica apoiada na mesma linha em que as letras se apoiam. */
  align-items: baseline;
  gap: ${({ theme }) => theme.espaco[1]};

  ${({ theme, $pequeno }) =>
    $pequeno &&
    css`
      ${Nome} {
        font-size: ${theme.fonte.tamanho.logoPequeno};
      }
    `}

  ${({ theme, $claro }) =>
    $claro &&
    css`
      ${Nome} {
        color: ${theme.cores.texto.sobreDestaque};
      }
    `}

  ${({ $animado }) =>
    $animado &&
    css`
      ${animar(surgir, ENTRADA)}

      ${Terra} {
        ${animar(aparecerDeBaixo, TERRA)}
      }

      ${Caule} {
        ${animar(desenharOCaule, CAULE, 'ease-in-out')}
      }

      ${FolhaDaEsquerda}, ${FolhaDaDireita} {
        /* Um leve passar do ponto no fim, como a folha se abrindo. */
        ${animar(abrir, FOLHAS, 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
      }

      ${Broto} {
        ${animar(abrir, BROTO)}
      }

      @media (prefers-reduced-motion: reduce) {
        &,
        ${Terra}, ${Caule}, ${FolhaDaEsquerda}, ${FolhaDaDireita}, ${Broto} {
          animation: none;
        }
      }
    `}
`
