import styled from 'styled-components'

// As telas de mapa do computador (o painel e a nova lavoura): o mapa ocupa a tela toda e, por
// cima dele, ficam as pílulas do topo (Casca) e uma coluna de cartões à esquerda, num vidro claro.
export const Tela = styled.main`
  position: relative;
  flex-grow: 1;
`

export const LadoDoMapa = styled.div`
  position: absolute;
  inset: 0;
`

// O vidro fosco por cima do mapa, de cima a baixo: à esquerda, o mapa borrado (com as cores um
// pouco mais vivas, como num vidro de verdade) e os cartões em cima; à direita, o mapa nítido.
// A sombra para o lado do mapa faz o vidro flutuar.
export const Vidro = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: ${({ theme }) => theme.largura.colunaDoPainel};
  background: ${({ theme }) => theme.cores.vidro.fundo};
  backdrop-filter: blur(${({ theme }) => theme.desfoque.vidro}) saturate(140%);
  box-shadow: ${({ theme }) => theme.sombra.vidro};
`

// Os cartões, por cima do vidro. A coluna começa embaixo das pílulas do topo: numa tela baixa,
// ela rola (sem mostrar a barra) e os cartões esmaecem ao chegar nas pílulas, em vez de passar
// por baixo delas.
export const Coluna = styled.section`
  position: absolute;
  top: ${({ theme }) => theme.altura.barraDoTopo};
  bottom: 0;
  left: 0;
  z-index: 1;
  width: ${({ theme }) => theme.largura.colunaDoPainel};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[10]}
    ${({ theme }) => theme.espaco[10]};
  overflow-y: auto;
  scrollbar-width: none;
  mask-image: linear-gradient(to bottom, transparent, black ${({ theme }) => theme.espaco[4]});

  &::-webkit-scrollbar {
    display: none;
  }
`

// Um cartão da coluna: cinza clarinho e transparente, com a fonte dos cartões.
export const Cartao = styled.div`
  font-family: ${({ theme }) => theme.fonte.familiaDosCartoes};
  background: ${({ theme }) => theme.cores.fundo.cartaoNoVidro};
  backdrop-filter: blur(${({ theme }) => theme.desfoque.cartao});
  border: ${({ theme }) => theme.espessura.linha} solid
    ${({ theme }) => theme.cores.fundo.bordaNoVidro};
  border-radius: ${({ theme }) => theme.raio.cartaoGrande};
  box-shadow: ${({ theme }) => theme.sombra.cartaoNoMapa};
`
