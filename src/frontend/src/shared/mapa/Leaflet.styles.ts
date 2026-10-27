import { css } from 'styled-components'
import { noCelular } from '../../styles/midia'

// O Leaflet traz o próprio estilo (leaflet.css, no main.tsx). Aqui ficam só os ajustes para o
// visual do app. O isolation segura as camadas do mapa embaixo dos cartões que flutuam por cima.
export const leafletDoTema = css`
  .leaflet-container {
    position: absolute;
    inset: 0;
    isolation: isolate;
    background: ${({ theme }) => theme.cores.fundo.mapa};
    font-family: inherit;
  }

  .leaflet-control-zoom.leaflet-bar {
    border: none;
    border-radius: ${({ theme }) => theme.raio.campo};
    box-shadow: ${({ theme }) => theme.sombra.flutuante};
    overflow: hidden;
  }

  /* No celular, aproxima com dois dedos; os botões ficariam embaixo da folha e da localização. */
  ${noCelular} {
    .leaflet-control-zoom {
      display: none;
    }
  }

  .leaflet-control-zoom a {
    color: ${({ theme }) => theme.cores.texto.principal};
    background: ${({ theme }) => theme.cores.fundo.cartao};
  }

  .leaflet-control-attribution {
    font-size: ${({ theme }) => theme.fonte.tamanho.mini};
    background: ${({ theme }) => theme.cores.fundo.cartaoNoVidro};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`
