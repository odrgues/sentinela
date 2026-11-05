import styled, { css, keyframes } from 'styled-components'
import { noCelular } from '../../../../styles/midia'
import type { NivelDoTema } from '../../../../shared/ui/nivel'
import type { Condicao } from '../../../../shared/ui/tempo'
import type { NivelDoDia } from '../../tipos'

const cartao = css`
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.cartao};
`

// O cartão branco da página da lavoura: sem borda, destacado do fundo pela sombra em duas camadas.
const superficie = css`
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.quadro};
  box-shadow: ${({ theme }) => theme.sombra.cartaoDaLavoura};
`

// O rótulo miúdo em maiúsculas, em cima de um título ou de um número.
const rotulo = css`
  font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  letter-spacing: ${({ theme }) => theme.fonte.espacamentoDoRotuloMiudo};
  text-transform: uppercase;
`

// O círculo com o ícone dentro, no começo dos cartões.
const chip = css`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: ${({ theme }) => theme.altura.chipDoIcone};
  height: ${({ theme }) => theme.altura.chipDoIcone};
  border-radius: ${({ theme }) => theme.raio.circulo};
`

// O cartão da previsão: as abas e a hora da atualização em cima, o gráfico e a legenda embaixo.
export const CartaoDoGrafico = styled.section`
  ${superficie}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};
  padding: ${({ theme }) => theme.espaco[11]} ${({ theme }) => theme.espaco[12]}
    ${({ theme }) => theme.espaco[12]};

  ${noCelular} {
    padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[7]}
      ${({ theme }) => theme.espaco[9]};
  }
`

// O ciclo da lavoura: verde-escuro como a faixa do alto, com as curvas de nível por trás. A data
// da colheita é o número grande; embaixo, a linha do tempo das fases e a fase de agora.
export const Ciclo = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[8]};
  padding: ${({ theme }) => theme.espaco[12]};
  border-radius: ${({ theme }) => theme.raio.quadro};
  background:
    ${({ theme }) => theme.texturas.curvasDoCiclo} right top /
      ${({ theme }) => theme.texturas.tamanhoDasCurvas} no-repeat,
    linear-gradient(
      155deg,
      ${({ theme }) => theme.cores.ciclo.fundo},
      ${({ theme }) => theme.cores.ciclo.fundoFim}
    );
  box-shadow:
    ${({ theme }) => theme.sombra.cartaoEscuro}, ${({ theme }) => theme.sombra.brilhoDoCartaoEscuro};
  color: ${({ theme }) => theme.cores.ciclo.texto};

  ${noCelular} {
    padding: ${({ theme }) => theme.espaco[9]};
  }
`

export const RotuloDoCiclo = styled.span`
  ${rotulo}
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[3]};
  color: ${({ theme }) => theme.cores.ciclo.textoSuave};
`

export const Colheita = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[6]};
`

export const TextoDaColheita = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[2]};

  > span:first-child {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    color: ${({ theme }) => theme.cores.ciclo.textoSuave};
  }
`

export const DataDaColheita = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.dataDaColheita};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.cores.marca.sol};

  ${noCelular} {
    font-size: ${({ theme }) => theme.fonte.tamanho.marca};
  }
`

// "faltam 59 dias", numa pílula ao lado da data.
export const Faltam = styled.span`
  padding: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[6]};
  border: ${({ theme }) => theme.espessura.linha} solid ${({ theme }) => theme.cores.ciclo.borda};
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.ciclo.painel};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  white-space: nowrap;
`

export const LinhaDoCiclo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[6]};

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    color: ${({ theme }) => theme.cores.ciclo.textoSuave};
  }
`

// O ciclo da perene: a safra (ou a cultura) e quando a colheita vem, no lugar da data grande.
export const TituloDaPerene = styled.strong`
  font-size: ${({ theme }) => theme.fonte.tamanho.titulo};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
  color: ${({ theme }) => theme.cores.marca.sol};
`

export const Explicacao = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.ciclo.textoSuave};
`

export const Barra = styled.div`
  height: ${({ theme }) => theme.altura.barraDoCiclo};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.ciclo.trilho};
`

// $agora: a fase de hoje, em amarelo, para se destacar das que já passaram (verde-claro).
export const Preenchida = styled.div<{ $agora?: boolean }>`
  height: 100%;
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme, $agora }) => ($agora ? theme.cores.marca.sol : theme.cores.ciclo.feito)};
`

// A barra do ciclo em trechos, um por fase, do tamanho de cada fase.
export const Trechos = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[2]};
  height: ${({ theme }) => theme.altura.barraDoCiclo};
`

export const Trecho = styled.div`
  position: relative;
  flex-basis: 0;
  min-width: ${({ theme }) => theme.espaco[4]};
`

export const TrilhoDoTrecho = styled.div`
  height: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.ciclo.trilho};
`

// O anel que se abre em volta do "você está aqui", o mesmo radar do ponto da foto do alto.
const pulso = keyframes`
  from {
    transform: scale(1);
    opacity: 0.8;
  }
  to {
    transform: scale(2.4);
    opacity: 0;
  }
`

// Onde a lavoura está hoje na linha do tempo: um ponto amarelo, com o anel pulsando.
export const MarcadorDeHoje = styled.span`
  position: absolute;
  top: 50%;
  width: ${({ theme }) => theme.largura.marcadorDoCiclo};
  height: ${({ theme }) => theme.largura.marcadorDoCiclo};
  transform: translate(-50%, -50%);
  border: ${({ theme }) => theme.espessura.faixa} solid ${({ theme }) => theme.cores.ciclo.fundo};
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme }) => theme.cores.marca.sol};
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: ${({ theme }) => theme.raio.circulo};
    background: ${({ theme }) => theme.cores.heroi.anel};
    animation: ${pulso} 2.4s ease-out infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }
`

// A fase de agora, dentro do cartão verde: um painel um tom mais claro.
export const Fase = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[7]};
  padding: ${({ theme }) => theme.espaco[8]};
  border: ${({ theme }) => theme.espessura.linha} solid ${({ theme }) => theme.cores.ciclo.borda};
  border-radius: ${({ theme }) => theme.raio.cartao};
  background: ${({ theme }) => theme.cores.ciclo.painel};

  > span:first-child {
    ${chip}
    background: ${({ theme }) => theme.cores.marca.sol};
    color: ${({ theme }) => theme.cores.destaque.base};
  }

  strong {
    display: block;
    margin: ${({ theme }) => theme.espaco[1]} 0 ${({ theme }) => theme.espaco[3]};
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
    color: ${({ theme }) => theme.cores.ciclo.textoSuave};
  }
`

export const RotuloDaFase = styled.span`
  ${rotulo}
  color: ${({ theme }) => theme.cores.marca.sol};
`

// O El Niño: azul-claro com as ondinhas do mar no canto de cima, esmaecendo para o resto.
export const Enso = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[7]};
  padding: ${({ theme }) => theme.espaco[12]};
  border-radius: ${({ theme }) => theme.raio.quadro};
  background: linear-gradient(
    160deg,
    ${({ theme }) => theme.cores.enso.fundo},
    ${({ theme }) => theme.cores.enso.fundoFim}
  );
  box-shadow: ${({ theme }) => theme.sombra.cartaoDaLavoura};
  color: ${({ theme }) => theme.cores.enso.titulo};

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto auto;
    width: 100%;
    height: 55%;
    background: ${({ theme }) => theme.texturas.ondasDoEnso} 0 0 /
      ${({ theme }) => theme.texturas.tamanhoDasOndas};
    mask-image: linear-gradient(
      200deg,
      ${({ theme }) => theme.cores.texto.principal},
      transparent 65%
    );
    pointer-events: none;
  }

  > * {
    position: relative;
  }

  ${noCelular} {
    padding: ${({ theme }) => theme.espaco[9]};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
    color: ${({ theme }) => theme.cores.enso.texto};
  }
`

export const TopoDoEnso = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[6]};

  > span:first-child {
    ${chip}
    width: ${({ theme }) => theme.altura.chipGrande};
    height: ${({ theme }) => theme.altura.chipGrande};
    background: ${({ theme }) => theme.cores.enso.titulo};
    color: ${({ theme }) => theme.cores.texto.sobreDestaque};
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.espaco[1]};
  }

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.nomeDaLavoura};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }
`

export const RotuloDoEnso = styled.span`
  ${rotulo}
  opacity: 0.75;
`

// O efeito da fase do El Niño e o que fazer: uma linha fina em cima, o rótulo miúdo e o texto.
export const EfeitoDoEnso = styled.p`
  && {
    padding-top: ${({ theme }) => theme.espaco[7]};
    border-top: ${({ theme }) => theme.espessura.linha} solid
      ${({ theme }) => theme.cores.enso.divisoria};
  }

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.espaco[2]};
    ${rotulo}
    color: ${({ theme }) => theme.cores.enso.titulo};
  }
`

// "Saiba mais" do El Niño: a explicação técnica, fechada até a pessoa abrir.
export const SaibaMais = styled.details`
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};

  summary {
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    cursor: pointer;
  }

  && p {
    margin-top: ${({ theme }) => theme.espaco[3]};
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  }
`

export const Fonte = styled.small`
  display: block;
  font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  opacity: 0.8;
`

export const Secao = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[7]};
  /* O "Ver o que fazer" do resumo rola até aqui sem colar a seção no alto da tela. */
  scroll-margin-top: ${({ theme }) => theme.espaco[14]};

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.tituloDeSecao};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
  }
`

// O resumo da semana: um cartão que flutua por cima da base da foto do alto. O ícone do nível
// numa bolinha cheia, o aviso mais sério e o botão para o que fazer. --sobreposicao é quanto ele
// sobe sobre a foto, e --respiro, o vão normal entre as partes da página.
export const Resumo = styled.section<{ $nivel: NivelDoTema }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[8]};
  margin: calc(-1 * (var(--respiro) + var(--sobreposicao))) ${({ theme }) => theme.espaco[12]} 0;
  padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[9]}
    ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[8]};
  border-radius: ${({ theme }) => theme.raio.quadro};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  box-shadow: ${({ theme }) => theme.sombra.cartaoErguido};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};

  ${noCelular} {
    flex-wrap: wrap;
    margin-inline: ${({ theme }) => theme.espaco[7]};
    padding: ${({ theme }) => theme.espaco[7]};
  }
`

export const IconeDoResumo = styled.span<{ $nivel: NivelDoTema }>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: ${({ theme }) => theme.altura.chipGrande};
  height: ${({ theme }) => theme.altura.chipGrande};
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].marcador};
  /* O halo em volta, na cor do nível, mais clara. */
  box-shadow: 0 0 0 ${({ theme }) => theme.espaco[3]}
    ${({ theme, $nivel }) => theme.cores.nivel[$nivel].selo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].sobreMarcador};

  ${noCelular} {
    width: ${({ theme }) => theme.altura.toque};
    height: ${({ theme }) => theme.altura.toque};
  }
`

export const TextoDoResumo = styled.p`
  flex: 1;
  min-width: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[2]};

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.secao};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }

  ${noCelular} {
    flex-basis: calc(
      100% - ${({ theme }) => theme.altura.toque} - ${({ theme }) => theme.espaco[8]}
    );
  }
`

export const LinkDoResumo = styled.a`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[4]};
  min-height: ${({ theme }) => theme.altura.toque};
  padding: 0 ${({ theme }) => theme.espaco[9]};
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.destaque.base};
  color: ${({ theme }) => theme.cores.texto.sobreDestaque};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-decoration: none;
  white-space: nowrap;
  transition: background 150ms ease;

  &:hover {
    background: ${({ theme }) => theme.cores.destaque.hover};
    color: ${({ theme }) => theme.cores.texto.sobreDestaque};
  }

  ${noCelular} {
    margin-left: calc(${({ theme }) => theme.altura.toque} + ${({ theme }) => theme.espaco[8]});
  }
`

// Os avisos da semana, um cartão por tipo de aviso: o nível e o título em cima, uma linha por dia
// e, embaixo, o que fazer (uma vez só, mesmo que o aviso se repita por vários dias). A faixa da
// beira esquerda tem a cor do nível mais sério do grupo.
export const GrupoDeAvisos = styled.article<{ $nivel: NivelDoTema }>`
  ${superficie}
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[10]} ${({ theme }) => theme.espaco[12]};

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: ${({ theme }) => theme.espessura.faixa};
    background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].marcador};
  }

  ${noCelular} {
    padding: ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[8]}
      ${({ theme }) => theme.espaco[8]} ${({ theme }) => theme.espaco[9]};
  }
`

export const TopoDoGrupo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[6]};
`

export const ChipDoNivel = styled.span<{ $nivel: NivelDoTema }>`
  ${chip}
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].selo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
`

export const TituloDoGrupo = styled.div<{ $nivel: NivelDoTema }>`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[1]};

  > span {
    ${rotulo}
    color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
  }

  > h3 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.nomeDaLavoura};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }
`

// "2 dias", na ponta do título.
export const QuantosDias = styled.span`
  padding: ${({ theme }) => theme.espaco[1]} ${({ theme }) => theme.espaco[5]};
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.fundo.rebaixado};
  color: ${({ theme }) => theme.cores.texto.secundario};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  white-space: nowrap;
`

export const LinhasDoGrupo = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
`

// Um dia do aviso. Passar o mouse nele acende o mesmo dia no gráfico, e a linha se destaca.
export const LinhaDoAviso = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[7]};
  margin-inline: -${({ theme }) => theme.espaco[7]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  border-radius: ${({ theme }) => theme.raio.cartao};
  transition: background 150ms ease;

  &:hover,
  &:focus-within {
    background: ${({ theme }) => theme.cores.fundo.rebaixado};
  }

  & + & {
    border-top: ${({ theme }) => theme.espessura.linha} solid
      ${({ theme }) => theme.cores.borda.divisoria};
  }
`

// O dia do aviso num quadradinho, na cor do nível dele: "sexta" e "30/10".
export const DiaDoAviso = styled.div<{ $nivel: NivelDoTema }>`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: ${({ theme }) => theme.largura.diaDoAviso};
  padding: ${({ theme }) => theme.espaco[3]} ${({ theme }) => theme.espaco[4]};
  border-radius: ${({ theme }) => theme.raio.etiqueta};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.mini};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    text-transform: capitalize;
  }

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.nomeDaLavoura};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
    font-variant-numeric: tabular-nums;
  }
`

export const TextoDoAviso = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[2]};
`

export const CorpoDoAviso = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
  color: ${({ theme }) => theme.cores.texto.principal};
`

// "O que fazer": um painel afundado no cartão, com a lâmpada na cor do nível.
export const OQueFazer = styled.div<{ $nivel: NivelDoTema }>`
  display: flex;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[8]};
  border-radius: ${({ theme }) => theme.raio.cartao};
  background: ${({ theme }) => theme.cores.fundo.rebaixado};
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
  color: ${({ theme }) => theme.cores.texto.principal};

  > span:first-child {
    ${chip}
    width: ${({ theme }) => theme.altura.avatar};
    height: ${({ theme }) => theme.altura.avatar};
    background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].selo};
    color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};

    /* No celular, a lâmpada sai para o texto ocupar a largura toda. */
    ${noCelular} {
      display: none;
    }
  }

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.espaco[2]};
    ${rotulo}
    color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
  }
`

export const PorQue = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[2]};
  padding: ${({ theme }) => theme.espaco[2]} 0;
  border: none;
  background: none;
  color: ${({ theme }) => theme.cores.texto.secundario};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.cores.texto.principal};
  }

  svg {
    transition: transform 150ms ease;
  }

  &[aria-expanded='true'] svg {
    transform: rotate(180deg);
  }
`

export const Explicado = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[6]};
  border-radius: ${({ theme }) => theme.raio.campo};
  background: ${({ theme }) => theme.cores.fundo.rebaixado};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Abas = styled.div<{ $variante: 'abas' | 'filtros' }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espaco[2]};

  ${({ theme, $variante }) =>
    $variante === 'abas' &&
    css`
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      padding: ${theme.espaco[2]};
      background: ${theme.cores.fundo.trilho};
      border-radius: ${theme.raio.botao};
    `}

  ${({ theme, $variante }) =>
    $variante === 'filtros' &&
    css`
      gap: ${theme.espaco[4]};
    `}
`

export const Aba = styled.button<{ $variante: 'abas' | 'filtros' }>`
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  cursor: pointer;

  ${({ theme, $variante }) =>
    $variante === 'abas' &&
    css`
      height: ${theme.altura.aba};
      padding: 0 ${theme.espaco[9]};
      border: none;
      border-radius: ${theme.raio.aba};
      background: transparent;
      color: ${theme.cores.texto.secundario};

      &[aria-pressed='true'] {
        background: ${theme.cores.fundo.cartao};
        color: ${theme.cores.texto.principal};
        box-shadow: ${theme.sombra.abaEscolhida};
      }
    `}

  ${({ theme, $variante }) =>
    $variante === 'filtros' &&
    css`
      height: ${theme.altura.avatar};
      padding: 0 ${theme.espaco[7]};
      font-size: ${theme.fonte.tamanho.legenda};
      border: ${theme.espessura.borda} solid ${theme.cores.borda.campo};
      border-radius: ${theme.raio.pilula};
      background: ${theme.cores.fundo.cartao};
      color: ${theme.cores.texto.principal};

      &[aria-pressed='true'] {
        background: ${theme.cores.texto.principal};
        border-color: ${theme.cores.texto.principal};
        color: ${theme.cores.texto.sobreDestaque};
      }
    `}
`

// "Previsão atualizada hoje às 7h", com a setinha de atualizar.
export const Atualizada = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[3]};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

const corDaFrase = css<{ $nivel: NivelDoDia }>`
  color: ${({ theme, $nivel }) =>
    $nivel === 'ok' ? theme.cores.destaque.base : theme.cores.nivel[$nivel].texto};
`

export const FraseDoDia = styled.span<{ $nivel: NivelDoDia }>`
  font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  ${corDaFrase}
`

export const Chuva = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[1]};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  color: ${({ theme }) => theme.cores.texto.secundario};

  svg {
    color: ${({ theme }) => theme.cores.tempo.chuva};
  }
`

// A data embaixo do dia da semana, discreta.
export const DataNoGrafico = styled.span`
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

// O gráfico da semana, solto na página: um dia por coluna, colunas coladas para a faixa ideal e
// os limites ficarem contínuos. No celular, rola para o lado.
export const Grafico = styled.ul`
  /* O texto só para o leitor de tela ("de chuva") é absoluto: sem isto, ele escapa da rolagem do
     gráfico e alarga a página no celular. */
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(${({ theme }) => theme.largura.diaNoGrafico}, 1fr);
  overflow-x: auto;
  scrollbar-width: thin;
`

// $emFoco: o dia do aviso que a pessoa está olhando.
export const DiaNoGrafico = styled.li<{ $nivel: NivelDoDia; $emFoco: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[2]};
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[3]};
  border-radius: ${({ theme }) => theme.raio.campo};
  background: ${({ theme, $nivel, $emFoco }) => {
    if ($nivel === 'critico') return theme.cores.diaCritico.fundo
    return $emFoco ? theme.cores.grafico.diaEmFoco : 'transparent'
  }};
  box-shadow: ${({ theme, $emFoco }) =>
    $emFoco ? `inset 0 0 0 ${theme.espessura.bordaDeErro} ${theme.cores.destaque.base}` : 'none'};
  text-align: center;
  transition:
    background 150ms ease,
    box-shadow 150ms ease;

  > strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }

  /* A chuva numa linha só, embaixo da barra. */
  ${Chuva} {
    white-space: nowrap;
  }
`

// A escala de temperatura do dia. Sai para os lados até a borda da coluna, para a faixa ideal e os
// limites emendarem com os dos outros dias.
export const Termometro = styled.div`
  position: relative;
  align-self: stretch;
  height: ${({ theme }) => theme.altura.trilhaDoGrafico};
  margin: 0 -${({ theme }) => theme.espaco[3]};
`

// O miolo da escala, com espaço em cima e embaixo para a máxima e a mínima.
export const Escala = styled.div`
  position: absolute;
  inset: ${({ theme }) => theme.espaco[12]} 0;
`

export const FaixaIdeal = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  border-block: ${({ theme }) => theme.espessura.borda} solid
    ${({ theme }) => theme.cores.grafico.bordaDaFaixa};
  background: ${({ theme }) => theme.cores.grafico.faixaIdeal};
`

export const Limite = styled.span<{ $tipo: 'calor' | 'frio' }>`
  position: absolute;
  left: 0;
  right: 0;
  border-top: ${({ theme }) => theme.espessura.borda} dashed
    ${({ theme, $tipo }) =>
      $tipo === 'calor' ? theme.cores.grafico.limiteDeCalor : theme.cores.grafico.limiteDeFrio};
`

// A barrinha do dia, da mínima (embaixo, fria) à máxima (em cima, quente).
export const Capsula = styled.span`
  position: absolute;
  left: 50%;
  width: ${({ theme }) => theme.largura.capsulaDoGrafico};
  transform: translateX(-50%);
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.cores.grafico.quente},
    ${({ theme }) => theme.cores.grafico.frio}
  );
`

// A máxima logo acima da barrinha e a mínima logo abaixo.
export const Maxima = styled.span`
  position: absolute;
  left: 50%;
  transform: translate(-50%, calc(-100% - ${({ theme }) => theme.espaco[2]}));
  white-space: nowrap;
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
`

export const Minima = styled.span`
  position: absolute;
  left: 50%;
  transform: translate(-50%, ${({ theme }) => theme.espaco[2]});
  white-space: nowrap;
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

// A chuva do dia numa barra que sobe do chão: cheia é a maior chuva da semana.
export const ChuvaNoGrafico = styled.span`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  align-self: stretch;
  height: ${({ theme }) => theme.altura.chuvaNoGrafico};
  border-bottom: ${({ theme }) => theme.espessura.borda} solid
    ${({ theme }) => theme.cores.borda.divisoria};
`

export const BarraDeChuva = styled.span`
  width: ${({ theme }) => theme.largura.barraDeChuva};
  border-radius: ${({ theme }) => theme.raio.barra} ${({ theme }) => theme.raio.barra} 0 0;
  background: ${({ theme }) => theme.cores.grafico.chuva};
`

// Como ler o gráfico: a faixa ideal, os limites e a chuva da semana.
export const Legenda = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.espaco[3]} ${({ theme }) => theme.espaco[10]};
  margin-top: ${({ theme }) => theme.espaco[4]};
  padding-top: ${({ theme }) => theme.espaco[8]};
  border-top: ${({ theme }) => theme.espessura.linha} solid
    ${({ theme }) => theme.cores.borda.divisoria};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  color: ${({ theme }) => theme.cores.texto.secundario};

  li {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.espaco[3]};
  }
`

export const AmostraDaFaixa = styled.span`
  width: ${({ theme }) => theme.largura.amostraDaLegenda};
  height: ${({ theme }) => theme.espaco[6]};
  border-block: ${({ theme }) => theme.espessura.borda} solid
    ${({ theme }) => theme.cores.grafico.bordaDaFaixa};
  background: ${({ theme }) => theme.cores.grafico.faixaIdeal};
`

export const AmostraDoLimite = styled.span<{ $tipo: 'calor' | 'frio' }>`
  width: ${({ theme }) => theme.largura.amostraDaLegenda};
  border-top: ${({ theme }) => theme.espessura.bordaDeErro} dashed
    ${({ theme, $tipo }) =>
      $tipo === 'calor' ? theme.cores.grafico.limiteDeCalor : theme.cores.grafico.limiteDeFrio};
`

export const AmostraDaChuva = styled.span`
  width: ${({ theme }) => theme.espaco[5]};
  height: ${({ theme }) => theme.espaco[7]};
  border-radius: ${({ theme }) => theme.raio.barra} ${({ theme }) => theme.raio.barra} 0 0;
  background: ${({ theme }) => theme.cores.grafico.chuva};
`

// Os ícones do tempo se mexem de leve, cada um do seu jeito. As partes do ícone (a nuvem, as
// gotas, o raio, os raios do sol) são os filhos do <svg> do Lucide, na ordem do desenho.
const gotaCaindo = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-40%);
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(70%);
  }
`

// Aceso quase o tempo todo, com duas piscadas rápidas, como um relâmpago.
const raioPiscando = keyframes`
  0%, 66%, 72%, 80%, 100% {
    opacity: 1;
  }
  69%, 76% {
    opacity: 0.15;
  }
`

const girando = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const nuvemBalancando = keyframes`
  from {
    transform: translateX(-6%);
  }
  to {
    transform: translateX(6%);
  }
`

const solPulsando = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0.45;
  }
`

const ANIMACAO_DO_TEMPO: Record<Condicao, ReturnType<typeof css>> = {
  chuva: css`
    > :nth-child(n + 2) {
      animation: ${gotaCaindo} 1.2s linear infinite;
      animation-delay: var(--atraso);
    }
    > :nth-child(3) {
      animation-delay: calc(var(--atraso) - 0.4s);
    }
    > :nth-child(4) {
      animation-delay: calc(var(--atraso) - 0.8s);
    }
  `,
  tempestade: css`
    > :nth-child(2) {
      animation: ${raioPiscando} 3s linear infinite;
      animation-delay: var(--atraso);
    }
  `,
  sol: css`
    animation: ${girando} 20s linear infinite;
    animation-delay: var(--atraso);
  `,
  sol_nuvens: css`
    > :nth-child(-n + 5) {
      animation: ${solPulsando} 2s ease-in-out infinite alternate;
      animation-delay: var(--atraso);
    }
    > :nth-child(6) {
      animation: ${nuvemBalancando} 3s ease-in-out infinite alternate;
      animation-delay: var(--atraso);
    }
  `,
  nublado: css`
    > * {
      animation: ${nuvemBalancando} 3s ease-in-out infinite alternate;
      animation-delay: var(--atraso);
    }
  `,
}

// $dia: a posição do dia na semana, para cada ícone começar a se mexer num momento diferente.
export const IconeDoTempo = styled.span<{
  $cor: 'sol' | 'nuvem' | 'chuva'
  $condicao: Condicao
  $dia: number
}>`
  --atraso: ${({ $dia }) => -$dia * 0.37}s;
  display: flex;
  color: ${({ theme, $cor }) => theme.cores.tempo[$cor]};

  svg {
    overflow: visible;
  }

  svg * {
    transform-box: fill-box;
    transform-origin: center;
  }

  /* Quem pediu menos movimento no sistema vê os ícones parados. */
  @media (prefers-reduced-motion: no-preference) {
    svg {
      ${({ $condicao }) => ANIMACAO_DO_TEMPO[$condicao]}
    }
  }
`

export const ListaDoHistorico = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
`

export const ItemDoHistorico = styled.li`
  ${cartao}
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[7]};
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};

  > span:last-child {
    margin-left: auto;
    color: ${({ theme }) => theme.cores.texto.secundario};
    white-space: nowrap;
  }
`

export const Selo = styled.span<{ $nivel: NivelDoTema }>`
  flex-shrink: 0;
  min-width: ${({ theme }) => theme.largura.seloDoHistorico};
  display: inline-block;
  padding: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[5]};
  border-radius: ${({ theme }) => theme.raio.selo};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
  text-align: center;
  white-space: nowrap;
`

export const Tabela = styled.div`
  ${cartao}
  overflow-x: auto;

  table {
    width: 100%;
    min-width: ${({ theme }) => theme.largura.tabelaDoHistorico};
    border-collapse: collapse;
    font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  }

  th {
    text-align: left;
    color: ${({ theme }) => theme.cores.texto.secundario};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }

  th,
  td {
    padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[8]};
  }

  tbody tr {
    border-top: ${({ theme }) => theme.espessura.linha} solid
      ${({ theme }) => theme.cores.borda.divisoria};
  }

  td:first-child {
    white-space: nowrap;
  }
`

export const Vazio = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.espaco[8]};
  text-align: center;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const LinkDiscreto = styled.button`
  align-self: center;
  min-height: ${({ theme }) => theme.altura.toque};
  padding: 0 ${({ theme }) => theme.espaco[5]};
  border: none;
  background: none;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  font-weight: ${({ theme }) => theme.fonte.peso.semiforte};
  color: ${({ theme }) => theme.cores.texto.secundario};
  text-decoration: underline;
  cursor: pointer;
`
