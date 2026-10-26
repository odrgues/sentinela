import { createGlobalStyle } from 'styled-components'

export const EstiloGlobal = createGlobalStyle`
  /* A fonte do nome no logo (Mortane, da Ragam Kata Studio, versão demo: só letras sem acento).
     O arquivo fica em public/fontes/mortane/. */
  @font-face {
    font-family: 'Mortane';
    src: url('/fontes/mortane/MortaneDEMO-Regular.ttf') format('truetype');
    font-display: swap;
  }

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

  /* A troca de página (ver app/transicoes.ts): a página que sai some e a nova aparece subindo
     de leve. As pílulas do topo têm nome próprio (Casca.styles.ts) e ficam paradas. */
  @keyframes sumir {
    to {
      opacity: 0;
    }
  }

  @keyframes chegar {
    from {
      opacity: 0;
      transform: translateY(1.5%);
    }
  }

  ::view-transition-old(root) {
    animation: sumir 180ms ease-in both;
  }

  ::view-transition-new(root) {
    animation: chegar 320ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both;
  }

  @media (prefers-reduced-motion: reduce) {
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
    }
  }

  ::placeholder {
    color: ${({ theme }) => theme.cores.texto.placeholder};
  }
`
