import { Link } from 'react-router'
import styled, { css } from 'styled-components'

const estilo = css`
  flex-shrink: 0;
  width: ${({ theme }) => theme.altura.toque};
  height: ${({ theme }) => theme.altura.toque};
  margin-left: -${({ theme }) => theme.espaco[5]};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  border-radius: ${({ theme }) => theme.raio.campo};
  background: none;
  color: ${({ theme }) => theme.cores.texto.principal};
  cursor: pointer;
`

export const VoltarLink = styled(Link)`
  ${estilo}
`

export const VoltarBotao = styled.button`
  ${estilo}
`
