import { Link } from 'react-router'
import styled, { css } from 'styled-components'

export type Variante = 'principal' | 'contorno' | 'neutro' | 'perigo'

const estilo = css<{ $variante: Variante }>`
  min-height: ${({ theme }) => theme.altura.botaoSecundario};
  padding: 0 ${({ theme }) => theme.espaco[8]};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.raio.botao};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.medio};
  text-align: center;
  text-decoration: none;
  cursor: pointer;

  ${({ theme, $variante }) =>
    $variante === 'principal' &&
    css`
      min-height: ${theme.altura.botao};
      font-size: ${theme.fonte.tamanho.botao};
      background: ${theme.cores.destaque.base};
      color: ${theme.cores.texto.sobreDestaque};
      border: none;

      &:hover {
        background: ${theme.cores.destaque.hover};
        color: ${theme.cores.texto.sobreDestaque};
      }
    `}

  ${({ theme, $variante }) =>
    $variante === 'contorno' &&
    css`
      background: transparent;
      color: ${theme.cores.destaque.base};
      border: ${theme.espessura.borda} solid ${theme.cores.destaque.base};
    `}

  ${({ theme, $variante }) =>
    $variante === 'neutro' &&
    css`
      background: ${theme.cores.fundo.cartao};
      color: ${theme.cores.texto.principal};
      border: ${theme.espessura.borda} solid ${theme.cores.borda.campo};
    `}

  ${({ theme, $variante }) =>
    $variante === 'perigo' &&
    css`
      min-height: ${theme.altura.botao};
      font-size: ${theme.fonte.tamanho.botao};
      background: ${theme.cores.erro};
      color: ${theme.cores.texto.sobreDestaque};
      border: none;

      &:hover {
        color: ${theme.cores.texto.sobreDestaque};
      }
    `}

  &:disabled {
    cursor: default;
    background: ${({ theme }) => theme.cores.fundo.carregandoSuave};
    color: ${({ theme }) => theme.cores.texto.secundario};
    border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  }
`

export const Botao = styled.button<{ $variante: Variante }>`
  ${estilo}
`

export const BotaoLink = styled(Link)<{ $variante: Variante }>`
  ${estilo}
`
