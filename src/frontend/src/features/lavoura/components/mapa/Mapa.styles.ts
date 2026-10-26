import styled, { css } from 'styled-components'
import { Botao as BotaoDoTema } from '../../../../shared/ui/Botao.styles'
import * as Busca from './BuscaDeEndereco.styles'
import { noCelular, noComputador } from '../../../../styles/midia'

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
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[7]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.cartaoGrande};
  box-shadow: ${({ theme }) => theme.sombra.cartaoNoMapa};

  ${noComputador} {
    left: ${({ theme }) => theme.espaco[11]};
    max-width: ${({ theme }) => theme.largura.textoDaFaixa};
  }
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

// Na tela cheia (nova lavoura no computador), os cartões do mapa ficam à direita do vidro,
// flutuando como as pílulas do painel.
const aoLadoDoVidro = css<ComTelaCheia>`
  ${noComputador} {
    ${({ theme, $telaCheia }) =>
      $telaCheia &&
      css`
        left: calc(${theme.largura.colunaDoPainel} + ${theme.espaco[10]});
        font-family: ${theme.fonte.familiaDosCartoes};
      `}
  }
`

// Nova lavoura (telaCheia), no computador e no celular. A busca sem cartão em volta: o campo é uma pílula branca com sombra, e as sugestões abrem num
// cartão logo abaixo.
const buscaFlutuante = css<ComTelaCheia>`
  ${({ theme, $telaCheia }) =>
    $telaCheia &&
    css`
      max-width: ${theme.largura.formulario};
      padding: 0;
      gap: ${theme.espaco[3]};
      background: none;
      box-shadow: none;

      ${Busca.Entrada} {
        background: ${theme.cores.fundo.cartao};
        border-color: ${theme.cores.fundo.bordaNoVidro};
        border-radius: ${theme.raio.pilula};
        box-shadow: ${theme.sombra.cartaoNoMapa};
      }

      ${Busca.Sugestoes} {
        background: ${theme.cores.fundo.cartao};
        border-color: ${theme.cores.fundo.bordaNoVidro};
        border-radius: ${theme.raio.cartaoGrande};
        box-shadow: ${theme.sombra.cartaoNoMapa};
      }
    `}
`

// "Usar minha localização" numa linha só: a instrução à esquerda e o botão compacto à direita.
const localizacaoNumaLinha = css<ComTelaCheia>`
  ${({ theme, $telaCheia }) =>
    $telaCheia &&
    css`
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: ${theme.espaco[4]} ${theme.espaco[6]};
      padding: ${theme.espaco[4]} ${theme.espaco[4]} ${theme.espaco[4]} ${theme.espaco[8]};
      background: ${theme.cores.fundo.cartaoNoVidro};
      backdrop-filter: blur(${theme.desfoque.cartao});
      border: ${theme.espessura.linha} solid ${theme.cores.fundo.bordaNoVidro};

      ${Instrucao} {
        flex: 1 1 0;
        min-width: 0;
        font-size: ${theme.fonte.tamanho.legenda};
      }

      /* No celular, só uma pílula pequena no canto, acima da borda da folha do formulário, como a
         bolinha da conta no painel. A instrução fica só para o leitor de tela (no celular, o
         cartão "Nenhum local marcado" da folha já explica). */
      ${noCelular} {
        left: auto;
        bottom: calc(${theme.espaco[11]} + ${theme.espaco[4]});
        padding: 0;
        background: none;
        backdrop-filter: none;
        border: none;
        box-shadow: none;

        ${Instrucao} {
          position: absolute;
          width: ${theme.espessura.linha};
          height: ${theme.espessura.linha};
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }

        ${BotaoDoTema} {
          padding: 0 ${theme.espaco[7]};
          background: ${theme.cores.fundo.cartao};
          border-color: ${theme.cores.fundo.bordaNoVidro};
          border-radius: ${theme.raio.pilula};
          box-shadow: ${theme.sombra.cartaoNoMapa};
          font-size: ${theme.fonte.tamanho.legenda};
        }

        ${ErroPequeno} {
          padding: ${theme.espaco[3]} ${theme.espaco[5]};
          background: ${theme.cores.fundo.cartao};
          border-radius: ${theme.raio.campo};
        }
      }

      ${BotaoDoTema} {
        flex-shrink: 0;
        min-height: ${theme.altura.botaoSecundario};
        padding: 0 ${theme.espaco[8]};
      }
    `}
`

export const CartaoDeCima = styled.div<ComTelaCheia>`
  ${cartao}
  top: ${({ theme }) => theme.espaco[8]};

  ${noComputador} {
    top: ${({ theme, $telaCheia }) =>
      $telaCheia ? `calc(${theme.altura.barraDoTopo} + ${theme.espaco[4]})` : theme.espaco[11]};
  }

  ${aoLadoDoVidro}
  ${buscaFlutuante}
`

export const CartaoDeBaixo = styled.div<ComTelaCheia>`
  ${cartao}
  bottom: ${({ theme }) => theme.espaco[8]};

  ${noComputador} {
    bottom: ${({ theme, $telaCheia }) => ($telaCheia ? theme.espaco[10] : theme.espaco[11])};
  }

  ${aoLadoDoVidro}
  ${localizacaoNumaLinha}
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
