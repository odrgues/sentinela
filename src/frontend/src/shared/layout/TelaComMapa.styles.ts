import styled from 'styled-components'
import folhas from '../../assets/folhas.jpg'

// As telas de mapa do computador (o painel e a nova lavoura): o mapa ocupa a tela toda e, por
// cima dele, ficam as pílulas do topo (Casca) e uma coluna de cartões à esquerda, num vidro verde.
export const Tela = styled.main`
  position: relative;
  flex-grow: 1;
`

export const LadoDoMapa = styled.div`
  position: absolute;
  inset: 0;
`

// O fundo da coluna, de cima a baixo, que divide a tela: à esquerda, a foto das folhas bem
// desfocada com um verde por cima e os cartões em cima de tudo; à direita, o mapa.
export const Vidro = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: ${({ theme }) => theme.largura.colunaDoPainel};
  overflow: hidden;
  border-right: ${({ theme }) => theme.espessura.linha} solid
    ${({ theme }) => theme.cores.vidro.borda};

  /* A foto passa um pouco das bordas, para o desfoque não clarear os cantos. */
  &::before {
    content: '';
    position: absolute;
    inset: -${({ theme }) => theme.espaco[14]};
    background: ${({ theme }) => theme.cores.fundo.mapa} url(${folhas}) center / cover no-repeat;
    filter: blur(${({ theme }) => theme.desfoque.foto});
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.cores.vidro.fundo};
  }
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
  box-shadow: ${({ theme }) => theme.sombra.flutuante};
`
