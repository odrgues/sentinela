import styled from 'styled-components'

export const Topo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: ${({ theme }) => theme.altura.toque};
  margin: ${({ theme }) => theme.espaco[6]} 0 ${({ theme }) => theme.espaco[4]};
`

// Do mesmo tamanho do botão de voltar, para a marca ficar no meio.
export const Vazio = styled.span`
  width: ${({ theme }) => theme.altura.toque};
`
