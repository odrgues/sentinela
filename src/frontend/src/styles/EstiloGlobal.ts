import { createGlobalStyle } from 'styled-components'

export const EstiloGlobal = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.cores.fundo.pagina};
    color: ${({ theme }) => theme.cores.texto.principal};
    font-family: ${({ theme }) => theme.fonte.familia};
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: ${({ theme }) => theme.cores.destaque.base};
  }

  a:hover {
    color: ${({ theme }) => theme.cores.destaque.hover};
  }

  :focus-visible {
    outline: ${({ theme }) => theme.espessura.foco} solid ${({ theme }) => theme.cores.foco};
    outline-offset: ${({ theme }) => theme.espaco[1]};
  }

  ::placeholder {
    color: ${({ theme }) => theme.cores.texto.placeholder};
  }
`
