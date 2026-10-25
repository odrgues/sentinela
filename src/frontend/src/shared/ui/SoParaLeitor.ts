import styled from 'styled-components'

// Texto que o leitor de tela lê e que não aparece: o rótulo de um campo de busca com ícone.
export const SoParaLeitor = styled.span`
  position: absolute;
  width: ${({ theme }) => theme.espessura.linha};
  height: ${({ theme }) => theme.espessura.linha};
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`
