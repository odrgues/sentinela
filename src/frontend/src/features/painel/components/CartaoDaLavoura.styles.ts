import { Link } from 'react-router'
import styled from 'styled-components'
import type { NivelDoTema } from '../../../shared/ui/nivel'

export const Cartao = styled(Link)`
  font-family: ${({ theme }) => theme.fonte.familiaDosCartoes};
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

// O nome e, ao lado, a cultura em cinza.
export const Titulo = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[4]};
`

export const Cultura = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Fase = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Andamento = styled.span`
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[5]};
  white-space: nowrap;
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Barra = styled.span`
  flex-grow: 1;
  display: block;
  height: ${({ theme }) => theme.altura.barraDoCicloPequena};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.fundo.trilho};
`

export const Preenchida = styled.span`
  display: block;
  height: 100%;
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.destaque.base};
`

export const Selo = styled.span<{ $nivel: NivelDoTema }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[3]};
  padding: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[5]};
  border-radius: ${({ theme }) => theme.raio.pilula};
  /* A cor viva da legenda e dos pinos do mapa, transparente. */
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].selo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
`
