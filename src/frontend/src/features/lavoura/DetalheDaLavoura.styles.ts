import styled, { keyframes } from 'styled-components'
import folhas from '../../assets/folhas.jpg'
import { noCelular } from '../../styles/midia'
import * as D from './components/detalhe/Detalhe.styles'

export const PaginaDoComputador = styled.main`
  width: 100%;
  max-width: ${({ theme }) => theme.largura.paginaDaLavoura};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[11]};
  padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[14]}
    ${({ theme }) => theme.espaco[14]};
`

// A lavoura que não existe (ou é de outra pessoa): o aviso centralizado, como a tela de erro.
export const NaoEncontrada = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[14]} 0;
  text-align: center;

  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDaTela};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }

  a {
    margin-top: ${({ theme }) => theme.espaco[4]};
    padding: 0 ${({ theme }) => theme.espaco[10]};
  }
`

export const Acoes = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.espaco[5]};
`

export const Previsao = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
`

export const LinhaDasAbas = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[6]};

  ${noCelular} {
    > * {
      flex-grow: 1;
    }
  }
`

export const Encerrada = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  border-radius: ${({ theme }) => theme.raio.campo};
  background: ${({ theme }) => theme.cores.fundo.semPrevisao};
  color: ${({ theme }) => theme.cores.texto.semPrevisao};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
`

// O topo do celular: a seta de voltar e o logo no meio.
export const TopoDoCelular = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
`

// A faixa do alto: a foto de satélite do lugar da lavoura ($foto), escurecida à esquerda para o
// texto branco aparecer. Sem a foto (nos testes, ou se ela não carregar), aparecem as folhas.
export const Heroi = styled.header<{ $foto?: string }>`
  position: relative;
  overflow: hidden;
  min-height: ${({ theme }) => theme.altura.heroi};
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[10]};
  border-radius: ${({ theme }) => theme.raio.cartaoGrande};
  background:
    linear-gradient(
      to right,
      ${({ theme }) => theme.cores.heroi.escuro},
      ${({ theme }) => theme.cores.heroi.claro}
    ),
    ${({ $foto }) => ($foto ? `url("${$foto}") center / cover no-repeat,` : '')}
      ${({ theme }) => theme.cores.fundo.carregando} url(${folhas}) center 40% / cover no-repeat;
  color: ${({ theme }) => theme.cores.texto.sobreDestaque};

  > * {
    position: relative;
  }

  ${noCelular} {
    min-height: ${({ theme }) => theme.altura.heroiNoCelular};
    padding: ${({ theme }) => theme.espaco[7]};
  }
`

// O anel que se abre em volta do ponto da lavoura, como um radar: a Sentinela de olho nela.
const radar = keyframes`
  from {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.9;
  }
  to {
    transform: translate(-50%, -50%) scale(3.2);
    opacity: 0;
  }
`

// O ponto amarelo no meio da foto, que é onde a lavoura foi marcada. No celular, o texto ocupa o
// meio da faixa, então o ponto não aparece.
export const PontoDaLavoura = styled.span`
  && {
    position: absolute;
  }
  top: 50%;
  left: 50%;
  width: ${({ theme }) => theme.largura.pontoDoHeroi};
  height: ${({ theme }) => theme.largura.pontoDoHeroi};
  transform: translate(-50%, -50%);
  border: ${({ theme }) => theme.espessura.bordaDeErro} solid
    ${({ theme }) => theme.cores.heroi.contornoDoPonto};
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme }) => theme.cores.heroi.ponto};
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    border-radius: ${({ theme }) => theme.raio.circulo};
    background: ${({ theme }) => theme.cores.heroi.anel};
    animation: ${radar} 2.4s ease-out infinite;
    transform: translate(-50%, -50%);

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  ${noCelular} {
    display: none;
  }
`

// Os créditos da foto, pequenos, no canto de cima.
export const CreditoDaFoto = styled.small`
  && {
    position: absolute;
  }
  top: ${({ theme }) => theme.espaco[3]};
  right: ${({ theme }) => theme.espaco[6]};
  font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  opacity: 0.75;
`

export const TextosDoHeroi = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[3]};

  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDoDetalhe};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};

    ${noCelular} {
      font-size: ${({ theme }) => theme.fonte.tamanho.tituloDaTela};
    }
  }

  > span {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    opacity: 0.9;
  }
`

// A cultura numa etiqueta clara, em cima do nome.
export const EtiquetaDaCultura = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[2]};
  padding: ${({ theme }) => theme.espaco[1]} ${({ theme }) => theme.espaco[4]};
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.destaque.suave};
  color: ${({ theme }) => theme.cores.destaque.sobreSuave};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
`

// O gráfico da semana (o resto da largura) e o ciclo (uma coluna estreita) lado a lado.
export const PrevisaoECiclo = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) ${({ theme }) => theme.largura.colunaDoCiclo};
  align-items: start;
  gap: ${({ theme }) => theme.espaco[8]};
`

// O ciclo ao lado do gráfico, alinhado com o gráfico (abaixo das abas).
export const LadoDoCiclo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[5]};
  padding-top: calc(${({ theme }) => theme.altura.aba} + ${({ theme }) => theme.espaco[9]});

  /* A colheita prevista em destaque, ao lado da previsão. */
  ${D.LinhaDoCiclo} {
    flex-direction: column-reverse;
    align-items: flex-start;
    gap: ${({ theme }) => theme.espaco[2]};

    span {
      font-size: ${({ theme }) => theme.fonte.tamanho.nomeDaLavoura};
      font-weight: ${({ theme }) => theme.fonte.peso.extra};
      color: ${({ theme }) => theme.cores.destaque.base};
    }

    strong {
      font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
      color: ${({ theme }) => theme.cores.texto.secundario};
    }
  }
`

// Os avisos da semana na largura toda: o dia em destaque à esquerda, o aviso no meio e o que
// fazer à direita.
export const AvisosLargos = styled.div`
  ${D.Aviso} {
    display: grid;
    grid-template-columns: auto minmax(0, 2fr) minmax(0, 3fr);
    align-items: start;
    gap: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[8]};

    > ${D.DiaDoAviso} {
      grid-column: 1;
      grid-row: 1 / span 3;
      flex-direction: column;
      align-items: center;
      gap: ${({ theme }) => theme.espaco[1]};
      min-width: ${({ theme }) => theme.largura.diaDoAviso};
      padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[5]};
      border-radius: ${({ theme }) => theme.raio.cartao};

      strong {
        font-size: ${({ theme }) => theme.fonte.tamanho.numero};
      }
    }

    > ${D.TopoDoAviso}, > ${D.PorQue}, > ${D.Explicado} {
      grid-column: 2;
    }

    > ${D.TopoDoAviso}:only-child {
      grid-column: 1 / -1;
    }

    > ${D.PorQue} {
      justify-self: start;
    }

    > ${D.OQueFazer} {
      grid-column: 3;
      grid-row: 1 / span 3;
      margin-left: 0;
    }
  }
`

// O celular, mais compacto: a faixa, as abas, o gráfico e os cartões menores, com os mesmos
// tamanhos das outras telas do celular.
export const PaginaDoCelular = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[8]}
    ${({ theme }) => theme.espaco[10]};

  ${Heroi} {
    min-height: 0;
    padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[7]};
  }

  ${TextosDoHeroi} {
    gap: ${({ theme }) => theme.espaco[2]};

    h1 {
      font-size: ${({ theme }) => theme.fonte.tamanho.secao};
    }

    > span {
      font-size: ${({ theme }) => theme.fonte.tamanho.mini};
    }
  }

  ${EtiquetaDaCultura} {
    font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  }

  ${D.Aba} {
    height: ${({ theme }) => theme.altura.aba};
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  ${D.Atualizada} {
    font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  }

  ${D.Grafico} {
    grid-auto-columns: minmax(${({ theme }) => theme.largura.diaNoGraficoPequeno}, 1fr);
  }

  ${D.DiaNoGrafico} {
    padding: ${({ theme }) => theme.espaco[3]} ${({ theme }) => theme.espaco[2]};

    > strong,
    ${D.Chuva}, ${D.Minima}, ${D.DataNoGrafico} {
      font-size: ${({ theme }) => theme.fonte.tamanho.mini};
    }

    /* No celular a coluna é estreita: a chuva pode quebrar em duas linhas. */
    ${D.Chuva} {
      flex-wrap: wrap;
      justify-content: center;
      white-space: normal;
    }
  }

  ${D.Termometro} {
    height: ${({ theme }) => theme.altura.trilhaDoGraficoPequena};
    margin: 0 -${({ theme }) => theme.espaco[2]};
  }

  ${D.Escala} {
    inset: ${({ theme }) => theme.espaco[11]} 0;
  }

  ${D.ChuvaNoGrafico} {
    height: ${({ theme }) => theme.altura.chuvaNoGraficoPequena};
  }

  ${D.Legenda} {
    font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  }

  ${D.Resumo} {
    align-items: flex-start;
    flex-wrap: wrap;
    padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  }

  /* O texto ocupa a linha toda ao lado do ícone; o "Ver o que fazer" desce, alinhado com ele. */
  ${D.TextoDoResumo} {
    flex-basis: calc(
      100% - ${({ theme }) => theme.altura.toque} - ${({ theme }) => theme.espaco[6]}
    );
  }

  ${D.LinkDoResumo} {
    margin-left: calc(${({ theme }) => theme.altura.toque} + ${({ theme }) => theme.espaco[6]});
  }

  ${D.Ciclo}, ${D.Fase}, ${D.Enso} {
    padding: ${({ theme }) => theme.espaco[6]};
  }

  ${D.LinhaDoCiclo} strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }

  ${D.LinhaDoCiclo} span,
  ${D.Explicacao} {
    font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  }

  ${D.Barra} {
    height: ${({ theme }) => theme.altura.barraDoCicloPequena};
  }

  ${D.Fase} p,
  ${D.Enso} p,
  ${D.EfeitoDoEnso} strong,
  ${D.SaibaMais} {
    font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  }

  ${D.Secao} h2 {
    font-size: ${({ theme }) => theme.fonte.tamanho.nomeDaLavoura};
  }

  ${D.Aviso} {
    gap: ${({ theme }) => theme.espaco[4]};
    padding: ${({ theme }) => theme.espaco[8]};
  }

  /* O ícone na linha do nível, e a mensagem embaixo na largura toda: o texto e o "O que fazer"
     começam na mesma margem, com o mesmo respiro dos dois lados. */
  ${D.TopoDoAviso} {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[3]};

    > div {
      display: contents;
    }

    ${D.CorpoDoAviso} {
      grid-column: 1 / -1;
    }
  }

  ${D.OQueFazer} {
    padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[6]};
  }

  ${D.DiaDoAviso} strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  }

  ${D.OQueFazer}, ${D.Explicado} {
    font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  }

  ${D.OQueFazer}, ${D.PorQue}, ${D.Explicado} {
    margin-left: 0;
  }
`
