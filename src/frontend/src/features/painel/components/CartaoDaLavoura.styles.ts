import { Link } from 'react-router'
import styled from 'styled-components'
import type { NivelDoTema } from '../../../shared/ui/nivel'

export const Cartao = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[7]};
  padding-left: ${({ theme }) => theme.espaco[8]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.cartao};
  color: ${({ theme }) => theme.cores.texto.principal};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.cores.texto.principal};
    border-color: ${({ theme }) => theme.cores.borda.campo};
  }

  > svg {
    flex-shrink: 0;
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const Bolinha = styled.span<{ $nivel: NivelDoTema }>`
  flex-shrink: 0;
  width: ${({ theme }) => theme.espaco[7]};
  height: ${({ theme }) => theme.espaco[7]};
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].marcador};
`

export const Textos = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[3]};
`

export const Nome = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.destaque};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

export const Andamento = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Selo = styled.span<{ $nivel: NivelDoTema }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[3]};
  padding: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[5]};
  border-radius: ${({ theme }) => theme.raio.selo};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`
