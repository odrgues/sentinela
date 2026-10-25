import styled from 'styled-components'
import { noComputador } from '../../styles/midia'

export const Pagina = styled.main`
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[11]}
    ${({ theme }) => theme.espaco[11]};

  ${noComputador} {
    width: 100%;
    max-width: ${({ theme }) => theme.largura.cartaoCentral};
    margin: ${({ theme }) => theme.espaco[13]} auto;
    padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[11]}
      ${({ theme }) => theme.espaco[11]};
    background: ${({ theme }) => theme.cores.fundo.cartao};
    border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
    border-radius: ${({ theme }) => theme.raio.cartaoGrande};
  }
`

// No computador, o mapa de trocar o local fica num quadro no meio da página.
export const MapaNoComputador = styled.main`
  width: 100%;
  max-width: ${({ theme }) => theme.largura.detalhe};
  margin: 0 auto;
  padding: ${({ theme }) => theme.espaco[11]} ${({ theme }) => theme.espaco[13]};

  > div {
    overflow: hidden;
    border-radius: ${({ theme }) => theme.raio.cartaoGrande};
  }
`

export const Recalcula = styled.p`
  margin: 0;
  display: flex;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  background: ${({ theme }) => theme.cores.enso.fundo};
  border-radius: ${({ theme }) => theme.raio.campo};
  color: ${({ theme }) => theme.cores.enso.titulo};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};

  svg {
    flex-shrink: 0;
  }
`

export const Excluir = styled.button`
  min-height: ${({ theme }) => theme.altura.toque};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.erro};
  cursor: pointer;
`

export const Aviso = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
`
