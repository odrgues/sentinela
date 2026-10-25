import { Link } from 'react-router'
import styled from 'styled-components'

// No computador: as lavouras à esquerda e o mapa à direita.
export const Tela = styled.main`
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
`

export const Coluna = styled.section`
  flex: 1 1 ${({ theme }) => theme.largura.colunaDoPainel};
  max-width: ${({ theme }) => theme.largura.cartaoCentral};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[10]};
  padding: ${({ theme }) => theme.espaco[12]};
`

export const LadoDoMapa = styled.div`
  position: relative;
  flex: 999 1 ${({ theme }) => theme.largura.mapa};
  min-height: ${({ theme }) => theme.altura.mapaDoPainelNoComputador};
`

export const Titulo = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.tituloComputador};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
`

export const CartaoDoClima = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[7]};
  padding: ${({ theme }) => theme.espaco[10]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.cartaoGrande};
`

export const Bloco = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};
`

// No celular: o mapa parado no alto, e a folha das lavouras sobe por cima dele ao rolar.
export const MapaNoAlto = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.altura.mapaNoCelular};
`

export const TopoFlutuante = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.espaco[8]};
  left: ${({ theme }) => theme.espaco[8]};
  right: ${({ theme }) => theme.espaco[8]};
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`

export const Saudacao = styled.h1`
  margin: 0;
  height: ${({ theme }) => theme.altura.botaoRedondo};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[4]};
  padding: 0 ${({ theme }) => theme.espaco[9]} 0 ${({ theme }) => theme.espaco[7]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.pilula};
  box-shadow: ${({ theme }) => theme.sombra.flutuante};
  font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};

  svg {
    color: ${({ theme }) => theme.cores.destaque.base};
  }
`

export const BotaoDaConta = styled(Link)`
  width: ${({ theme }) => theme.altura.botaoRedondo};
  height: ${({ theme }) => theme.altura.botaoRedondo};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.circulo};
  box-shadow: ${({ theme }) => theme.sombra.flutuante};
  color: ${({ theme }) => theme.cores.texto.principal};

  &:hover {
    color: ${({ theme }) => theme.cores.texto.principal};
  }
`

export const Folha = styled.main`
  position: relative;
  z-index: 1;
  min-height: calc(100dvh - ${({ theme }) => theme.altura.inicioDaFolha});
  margin-top: ${({ theme }) => theme.altura.inicioDaFolha};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};
  padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[10]}
    ${({ theme }) => theme.espaco[10]};
  background: ${({ theme }) => theme.cores.fundo.pagina};
  border-radius: ${({ theme }) => theme.raio.folha} ${({ theme }) => theme.raio.folha} 0 0;
  box-shadow: ${({ theme }) => theme.sombra.folha};
`

export const Alca = styled.div`
  align-self: center;
  width: ${({ theme }) => theme.largura.alcaDaFolha};
  height: ${({ theme }) => theme.altura.alcaDaFolha};
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.borda.campo};
`
