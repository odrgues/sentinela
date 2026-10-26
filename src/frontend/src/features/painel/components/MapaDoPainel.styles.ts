import styled from 'styled-components'
import type { NivelDoTema } from '../../../shared/ui/nivel'

export const Area = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.cores.fundo.mapa};
`

export const SemMapa = styled.p`
  position: absolute;
  inset: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.espaco[14]} ${({ theme }) => theme.espaco[11]};
  text-align: center;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};

  strong {
    color: ${({ theme }) => theme.cores.texto.principal};
  }
`

export const Marcador = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`

export const Etiqueta = styled.span`
  padding: ${({ theme }) => theme.espaco[3]} ${({ theme }) => theme.espaco[5]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.etiqueta};
  box-shadow: ${({ theme }) => theme.sombra.etiqueta};
  font-family: ${({ theme }) => theme.fonte.familia};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.texto.principal};
  white-space: nowrap;
`

// No canto de cima, embaixo da pílula da conta: no canto de baixo ficam os botões de zoom.
export const Legenda = styled.div`
  position: absolute;
  top: calc(${({ theme }) => theme.altura.barraDoTopo} + ${({ theme }) => theme.espaco[4]});
  right: ${({ theme }) => theme.espaco[10]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.campo};
  box-shadow: ${({ theme }) => theme.sombra.flutuante};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};

  strong {
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }
`

export const ItemDaLegenda = styled.span<{ $nivel: NivelDoTema }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[4]};

  &::before {
    content: '';
    width: ${({ theme }) => theme.altura.bolinhaDaLegenda};
    height: ${({ theme }) => theme.altura.bolinhaDaLegenda};
    border-radius: ${({ theme }) => theme.raio.circulo};
    background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].marcador};
  }
`
