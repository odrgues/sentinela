import styled from 'styled-components'

export const Topo = styled.div`
  display: flex;
  align-items: center;
  min-height: ${({ theme }) => theme.altura.toque};
  margin: ${({ theme }) => theme.espaco[6]} 0 ${({ theme }) => theme.espaco[4]};
`
