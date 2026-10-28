import styled, { css, keyframes } from 'styled-components'
import type { NivelDoTema } from '../../../../shared/ui/nivel'
import type { Condicao } from '../../../../shared/ui/tempo'
import type { NivelDoDia } from '../../tipos'

const cartao = css`
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border: ${({ theme }) => theme.espessura.borda} solid ${({ theme }) => theme.cores.borda.cartao};
  border-radius: ${({ theme }) => theme.raio.cartao};
`

export const Ciclo = styled.div`
  ${cartao}
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[4]};
  padding: ${({ theme }) => theme.espaco[8]};
`

export const LinhaDoCiclo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: ${({ theme }) => theme.espaco[4]};

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    color: ${({ theme }) => theme.cores.texto.secundario};
  }
`

export const Explicacao = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonte.tamanho.apoio};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme }) => theme.cores.texto.secundario};
`

export const Barra = styled.div`
  height: ${({ theme }) => theme.altura.barraDoCiclo};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.fundo.trilho};
`

export const Preenchida = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme }) => theme.cores.destaque.base};
`

// A barra do ciclo em trechos, um por fase, do tamanho de cada fase.
export const Trechos = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[1]};
  height: ${({ theme }) => theme.altura.barraDoCiclo};
`

// $agora: a fase de hoje, com o fundo verde-claro para se destacar das que ainda vêm.
export const Trecho = styled.div<{ $agora: boolean }>`
  flex-basis: 0;
  min-width: ${({ theme }) => theme.espaco[2]};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.raio.barra};
  background: ${({ theme, $agora }) =>
    $agora ? theme.cores.destaque.suave : theme.cores.fundo.trilho};
  box-shadow: ${({ theme, $agora }) =>
    $agora ? `inset 0 0 0 ${theme.espessura.linha} ${theme.cores.destaque.base}` : 'none'};
`

export const Enso = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[8]};
  background: ${({ theme }) => theme.cores.enso.fundo};
  border-radius: ${({ theme }) => theme.raio.cartao};
  color: ${({ theme }) => theme.cores.enso.titulo};

  svg {
    flex-shrink: 0;
  }

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.espaco[2]};
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
    color: ${({ theme }) => theme.cores.enso.texto};
  }
`

// O efeito da fase do El Niño e o que fazer, embaixo da frase do cartão.
export const EfeitoDoEnso = styled.p`
  && {
    margin-top: ${({ theme }) => theme.espaco[4]};
  }

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.espaco[1]};
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`

// A fase do ciclo em que a lavoura está, com o que ela pede.
export const Fase = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[8]};
  background: ${({ theme }) => theme.cores.destaque.suave};
  border-radius: ${({ theme }) => theme.raio.cartao};
  color: ${({ theme }) => theme.cores.destaque.sobreSuave};

  svg {
    flex-shrink: 0;
  }

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.espaco[2]};
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }
`

// "Saiba mais" do El Niño: a explicação técnica, fechada até a pessoa abrir.
export const SaibaMais = styled.details`
  margin-top: ${({ theme }) => theme.espaco[4]};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};

  summary {
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    cursor: pointer;
  }

  && p {
    margin-top: ${({ theme }) => theme.espaco[2]};
  }
`

export const Fonte = styled.small`
  display: block;
  margin-top: ${({ theme }) => theme.espaco[4]};
  font-size: ${({ theme }) => theme.fonte.tamanho.mini};
  opacity: 0.85;
`

export const Secao = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[6]};
  /* O "Ver o que fazer" do resumo rola até aqui sem colar a seção no alto da tela. */
  scroll-margin-top: ${({ theme }) => theme.espaco[14]};

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonte.tamanho.nomeDaLavoura};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }
`

// O resumo da semana, embaixo da foto: o ícone do nível, o aviso mais sério e o link para o que
// fazer, na cor do nível.
export const Resumo = styled.section<{ $nivel: NivelDoTema }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[8]};
  border-radius: ${({ theme }) => theme.raio.botao};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
`

export const IconeDoResumo = styled.span<{ $nivel: NivelDoTema }>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: ${({ theme }) => theme.altura.toque};
  height: ${({ theme }) => theme.altura.toque};
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].marcador};
`

export const TextoDoResumo = styled.p`
  flex: 1;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[1]};

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  }
`

export const LinkDoResumo = styled.a`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  min-height: ${({ theme }) => theme.altura.botaoSecundario};
  padding: 0 ${({ theme }) => theme.espaco[7]};
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  color: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`

export const Aviso = styled.div<{ $nivel: NivelDoTema }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.espaco[3]};
  padding: ${({ theme }) => theme.espaco[7]} ${({ theme }) => theme.espaco[8]};
  border-radius: ${({ theme }) => theme.raio.botao};
  background: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].fundo};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};
`

// O dia do aviso em destaque. No celular, uma pílula em cima do aviso; no computador, um bloco
// à esquerda (DetalheDaLavoura.styles.ts).
export const DiaDoAviso = styled.div<{ $nivel: NivelDoTema }>`
  align-self: flex-start;
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.espaco[3]};
  padding: ${({ theme }) => theme.espaco[2]} ${({ theme }) => theme.espaco[6]};
  border-radius: ${({ theme }) => theme.raio.pilula};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].texto};

  span {
    font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
    text-transform: capitalize;
  }

  strong {
    font-size: ${({ theme }) => theme.fonte.tamanho.nomeDaLavoura};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
    line-height: ${({ theme }) => theme.fonte.alturaLinha.justa};
  }
`

export const TopoDoAviso = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.espaco[4]};

  svg {
    flex-shrink: 0;
  }

  strong {
    display: block;
    font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
    font-weight: ${({ theme }) => theme.fonte.peso.extra};
  }
`

export const CorpoDoAviso = styled.span<{ $nivel: NivelDoTema }>`
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].corpo};
`

// "O que fazer": sempre aberto, embaixo da mensagem, alinhado com o texto.
export const OQueFazer = styled.div<{ $nivel: NivelDoTema }>`
  margin-left: ${({ theme }) => theme.espaco[12]};
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[5]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.campo};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.media};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].corpo};

  strong {
    display: block;
    margin-bottom: ${({ theme }) => theme.espaco[1]};
    font-weight: ${({ theme }) => theme.fonte.peso.forte};
  }
`

// Alinhado com o texto, depois do ícone.
export const PorQue = styled.button`
  align-self: flex-start;
  margin-left: ${({ theme }) => theme.espaco[12]};
  min-height: ${({ theme }) => theme.altura.botaoSecundario};
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  text-decoration: underline;
  cursor: pointer;
`

export const Explicado = styled.p<{ $nivel: NivelDoTema }>`
  margin: 0 0 0 ${({ theme }) => theme.espaco[12]};
  font-size: ${({ theme }) => theme.fonte.tamanho.legenda};
  line-height: ${({ theme }) => theme.fonte.alturaLinha.solta};
  color: ${({ theme, $nivel }) => theme.cores.nivel[$nivel].corpo};
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

export const Atualizada = styled.span`
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
