import styled, { createGlobalStyle, css, keyframes } from 'styled-components'
import folhas from '../../assets/folhas.jpg'
import { noCelular } from '../../styles/midia'

// O fundo da página da lavoura é um verde-acinzentado bem claro, e não o branco do resto do site:
// os cartões brancos saltam dele com a sombra. Vale só enquanto a página está aberta.
export const FundoDaLavoura = createGlobalStyle`
  html body {
    background: ${({ theme }) => theme.cores.fundo.paginaDaLavoura};
  }
`

// --respiro é o vão entre as partes da página; --sobreposicao, quanto o resumo da semana sobe
// por cima da base da foto.
export const PaginaDoComputador = styled.main`
  --respiro: ${({ theme }) => theme.espaco[12]};
  --sobreposicao: ${({ theme }) => theme.espaco[12]};
  width: 100%;
  max-width: ${({ theme }) => theme.largura.paginaDaLavoura};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--respiro);
  padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[14]}
    ${({ theme }) => theme.espaco[14]};
`

// A previsão e os avisos à esquerda; o ciclo e o El Niño numa coluna estreita à direita.
export const Grade = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) ${({ theme }) => theme.largura.colunaDoCiclo};
  align-items: start;
  gap: ${({ theme }) => theme.espaco[12]};
`

export const Principal = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[12]};
`

export const Lateral = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[12]};
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
export const Heroi = styled.header<{ $foto?: string; $comResumo: boolean }>`
  position: relative;
  overflow: hidden;
  min-height: ${({ theme }) => theme.altura.heroi};
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[10]};
  ${({ theme, $comResumo }) =>
    $comResumo &&
    css`
      /* O resumo da semana cobre a base da foto: a faixa cresce o que ele cobre, para a foto
         continuar do mesmo tamanho, e o texto sobe para não ficar embaixo dele. */
      min-height: calc(${theme.altura.heroi} + var(--sobreposicao));
      padding-bottom: calc(${theme.espaco[8]} + var(--sobreposicao));
    `}
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
    ${({ theme, $comResumo }) =>
      $comResumo &&
      css`
        min-height: calc(${theme.altura.heroiNoCelular} + var(--sobreposicao));
        padding-bottom: calc(${theme.espaco[7]} + var(--sobreposicao));
      `}
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

// O celular, mais compacto: a faixa, o resumo, a previsão e os cartões, um embaixo do outro.
export const PaginaDoCelular = styled.main`
  --respiro: ${({ theme }) => theme.espaco[8]};
  --sobreposicao: ${({ theme }) => theme.espaco[9]};
  display: flex;
  flex-direction: column;
  gap: var(--respiro);
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[8]}
    ${({ theme }) => theme.espaco[10]};

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
`
