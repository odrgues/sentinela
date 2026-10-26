import styled, { css } from 'styled-components'
import { noComputador } from '../../../../styles/midia'

// Tela cheia: no computador, o mapa ocupa a tela toda, embaixo do vidro (nova lavoura).
type ComTelaCheia = { $telaCheia?: boolean }

export const Area = styled.div<ComTelaCheia>`
  position: relative;
  overflow: hidden;
  height: 100dvh;
  background: ${({ theme }) => theme.cores.fundo.mapa};

  ${noComputador} {
    height: auto;
    min-height: ${({ theme }) => theme.altura.mapaNoComputador};
    flex: 999 1 ${({ theme }) => theme.largura.mapa};

    ${({ $telaCheia }) =>
      $telaCheia &&
      css`
        position: absolute;
        inset: 0;
        min-height: 0;
      `}
  }
`

const cartao = css`
  position: absolute;
  left: ${({ theme }) => theme.espaco[8]};
  right: ${({ theme }) => theme.espaco[8]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[9]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.cartaoGrande};
  box-shadow: ${({ theme }) => theme.sombra.cartaoNoMapa};

  ${noComputador} {
    left: ${({ theme }) => theme.espaco[11]};
    max-width: ${({ theme }) => theme.largura.textoDaFaixa};
  }
`

// Na tela cheia, os cartões do mapa ficam à direita do vidro, abaixo das pílulas do topo.
const aoLadoDoVidro = css<ComTelaCheia>`
  ${noComputador} {
    ${({ theme, $telaCheia }) =>
      $telaCheia &&
      css`
        left: calc(${theme.largura.colunaDoPainel} + ${theme.espaco[10]});
        padding: ${theme.espaco[7]};
        background: ${theme.cores.fundo.cartaoNoVidro};
        backdrop-filter: blur(${theme.desfoque.cartao});
        font-family: ${theme.fonte.familiaDosCartoes};
      `}
  }
`

export const CartaoDeCima = styled.div<ComTelaCheia>`
  ${cartao}
  top: ${({ theme }) => theme.espaco[8]};

  ${noComputador} {
    top: ${({ theme, $telaCheia }) =>
      $telaCheia ? `calc(${theme.altura.barraDoTopo} + ${theme.espaco[4]})` : theme.espaco[11]};
  }

  ${aoLadoDoVidro}
`

export const CartaoDeBaixo = styled.div<ComTelaCheia>`
  ${cartao}
  bottom: ${({ theme }) => theme.espaco[8]};

  ${noComputador} {
    bottom: ${({ theme, $telaCheia }) => ($telaCheia ? theme.espaco[10] : theme.espaco[11])};
  }

  ${aoLadoDoVidro}
`

export const Instrucao = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
`

export const ErroPequeno = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
  color: ${({ theme }) => theme.cores.erro};
`

// A ponta do marcador fica no centro do mapa: é esse ponto que vira a latitude e a longitude.
export const Marcador = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -92%);
  pointer-events: none;
`

// O aviso de mapa desligado fica logo abaixo da ponta do marcador.
export const SemMapa = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: calc(50% + ${({ theme }) => theme.espaco[11]});
  margin: 0 auto;
  max-width: ${({ theme }) => theme.largura.formulario};
  padding: 0 ${({ theme }) => theme.espaco[11]};
  text-align: center;
  color: ${({ theme }) => theme.cores.texto.secundario};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};

  p {
    margin: 0;
  }

  strong {
    display: block;
    color: ${({ theme }) => theme.cores.texto.principal};
  }
`
