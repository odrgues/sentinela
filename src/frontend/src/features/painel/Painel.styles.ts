import { Link } from 'react-router'
import styled from 'styled-components'
import * as TelaComMapa from '../../shared/layout/TelaComMapa.styles'
import * as Lavoura from './components/CartaoDaLavoura.styles'
import type { NivelDoTema } from '../../shared/ui/nivel'
import { Lista, Temperatura } from './components/Painel.styles'

// No computador, a tela de mapa compartilhada com a nova lavoura (TelaComMapa.styles.ts); aqui
// fica só o que é do painel: os cartões do resumo e os quadrinhos das lavouras.
export { LadoDoMapa, Tela, Vidro } from '../../shared/layout/TelaComMapa.styles'

export const Coluna = styled(TelaComMapa.Coluna)`
  /* As lavouras em quadrinhos, dois por linha: quatro lavouras fazem um bloco de 2 por 2. */
  ${Lista} {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${({ theme }) => theme.espaco[4]};

    > li {
      display: flex;
    }
  }

  /* Quase quadrado; cresce se o texto pedir, e os dois da mesma linha ficam iguais. */
  ${Lavoura.Cartao} {
    flex-grow: 1;
    min-width: 0;
    min-height: ${({ theme }) => theme.altura.quadrinhoDaLavoura};
    flex-direction: column;
    align-items: stretch;
    padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[6]};
    border: ${({ theme }) => theme.espessura.linha} solid
      ${({ theme }) => theme.cores.fundo.bordaNoVidro};
    border-radius: ${({ theme }) => theme.raio.cartaoGrande};
    background: ${({ theme }) => theme.cores.fundo.cartaoNoVidro};
    backdrop-filter: blur(${({ theme }) => theme.desfoque.cartao});
    box-shadow: ${({ theme }) => theme.sombra.flutuante};
    transition:
      transform 200ms ease,
      box-shadow 200ms ease;

    /* Com o mouse em cima, o quadrinho sobe um pouco. */
    &:hover {
      border-color: ${({ theme }) => theme.cores.fundo.bordaNoVidro};
      transform: translateY(-${({ theme }) => theme.espaco[1]});
      box-shadow: ${({ theme }) => theme.sombra.cartaoNoMapa};
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;

      &:hover {
        transform: none;
      }
    }

    /* A setinha some: o quadrinho inteiro é o link. */
    > svg {
      display: none;
    }
  }

  ${Lavoura.Textos} {
    gap: ${({ theme }) => theme.espaco[3]};
  }

  /* A ordem de leitura do quadrinho: a cultura num rótulo pequeno, o nome em destaque, a fase
     em cinza, o aviso e, no pé, o dia do ciclo. */
  ${Lavoura.Titulo} {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.espaco[1]};
  }

  ${Lavoura.Cultura} {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
    letter-spacing: ${({ theme }) => theme.fonte.espacamentoDoRotulo};
    text-transform: uppercase;
  }

  ${Lavoura.Nome} {
    font-size: ${({ theme }) => theme.fonte.tamanho.nomeDaLavoura};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
  }

  ${Lavoura.Fase} {
    margin-top: -${({ theme }) => theme.espaco[1]};
  }

  /* Com duas linhas, o aviso fica com cantos de cartão em vez de pílula. */
  ${Lavoura.Selo} {
    align-items: flex-start;
    padding: ${({ theme }) => theme.espaco[3]} ${({ theme }) => theme.espaco[4]};
    border-radius: ${({ theme }) => theme.raio.cartao};
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  /* O dia do ciclo e a barrinha no pé do quadrinho. */
  ${Lavoura.Andamento} {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.espaco[2]};
    margin-top: auto;
  }
`

// O clima de hoje e, embaixo, quantas lavouras estão em cada nível de aviso.
export const CartaoDoClima = styled(TelaComMapa.Cartao)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[3]};
  padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[7]};

  ${Temperatura} {
    font-size: ${({ theme }) => theme.fonte.tamanho.titulo};
  }
`

export const Atualizada = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Resumo = styled.ul`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[5]} 0 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espaco[3]};
  border-top: ${({ theme }) => theme.espessura.linha} solid
    ${({ theme }) => theme.cores.borda.cartao};
`

export const Destaques = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};

  strong {
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`

// O ícone tem a cor do aviso; a próxima colheita, sem nível, fica com o verde da marca.
export const Destaque = styled.li<{ $nivel?: NivelDoTema }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[4]};

  svg {
    flex-shrink: 0;
    margin-top: ${({ theme }) => theme.espaco[1]};
    color: ${({ theme, $nivel }) =>
      $nivel ? theme.cores.nivel[$nivel].marcador : theme.cores.destaque.base};
  }
`

export const ItemDoResumo = styled.li<{ $nivel: NivelDoTema }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[3]};
  padding: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[5]};
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].selo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};

  strong {
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }
`

// No celular: o mapa parado no alto, e a folha das lavouras sobe por cima dele ao rolar.
export const MapaNoAlto = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.altura.mapaNoCelular};
`

export const TopoFlutuante = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.espaco[8]};
  left: ${({ theme }) => theme.espaco[8]};
  right: ${({ theme }) => theme.espaco[8]};
  z-index: 2;
  display: flex;
  align-items: center;
  /* Só o botão da conta, à direita. */
  justify-content: flex-end;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`

export const BotaoDaConta = styled(Link)`
  width: ${({ theme }) => theme.altura.botaoRedondo};
  height: ${({ theme }) => theme.altura.botaoRedondo};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.circulo};
  box-shadow: ${({ theme }) => theme.sombra.flutuante};
  color: ${({ theme }) => theme.cores.texto.principal};

  &:hover {
    color: ${({ theme }) => theme.cores.texto.principal};
  }
`

export const Folha = styled.main`
  position: relative;
  z-index: 1;
  min-height: calc(100dvh - ${({ theme }) => theme.altura.inicioDaFolha});
  margin-top: ${({ theme }) => theme.altura.inicioDaFolha};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};
  padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[10]}
    ${({ theme }) => theme.espaco[10]};
  background: ${({ theme }) => theme.cores.fundo.pagina};
  border-radius: ${({ theme }) => theme.raio.folha} ${({ theme }) => theme.raio.folha} 0 0;
  box-shadow: ${({ theme }) => theme.sombra.folha};
`

export const Alca = styled.div`
  align-self: center;
  width: ${({ theme }) => theme.largura.alcaDaFolha};
  height: ${({ theme }) => theme.altura.alcaDaFolha};
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.borda.campo};
`
