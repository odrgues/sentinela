import { useTheme } from 'styled-components'
import { diaCurto, diaEMes } from '../../../../shared/formato/data'
import { SoParaLeitor } from '../../../../shared/ui/SoParaLeitor'
import { ICONE_DO_TEMPO, NOME_DO_TEMPO, type Condicao } from '../../../../shared/ui/tempo'
import { escalaDaSemana } from '../../detalhe'
import type { DiaDePrevisao, LimitesDaCultura } from '../../tipos'
import * as S from './Detalhe.styles'

const COR_DO_TEMPO: Record<Condicao, 'sol' | 'nuvem' | 'chuva'> = {
  sol: 'sol',
  sol_nuvens: 'sol',
  nublado: 'nuvem',
  chuva: 'chuva',
  tempestade: 'chuva',
}

// A barra de chuva cheia é a maior chuva da semana, mas nunca menos que 10 mm: 2 mm não pode
// parecer um temporal.
const CHUVA_MINIMA_DA_ESCALA = 10

function numero(valor: number) {
  return valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
}

// "3,5 mm" na coluna, que é estreita; o "de chuva" fica para o leitor de tela.
function Chuva({ milimetros }: { milimetros: number }) {
  if (milimetros === 0) return <>Sem chuva</>
  return (
    <>
      {numero(milimetros)} mm<SoParaLeitor> de chuva</SoParaLeitor>
    </>
  )
}

type Props = {
  previsao: DiaDePrevisao[]
  limites?: LimitesDaCultura | null
  // O dia do aviso que a pessoa está olhando, aceso no gráfico.
  diaEmFoco?: string | null
}

// Os 7 dias a partir de hoje num gráfico, como no app do tempo: um dia por coluna, com o ícone, a
// barrinha da mínima à máxima sobre a faixa ideal da cultura, a chuva em barras e, só nos dias
// fora do normal, o que o dia significa para a lavoura.
export function PrevisaoDaSemana({ previsao, limites, diaEmFoco }: Props) {
  const tema = useTheme()
  const { y, ideal, calor, frio } = escalaDaSemana(previsao, limites)
  const escalaDaChuva = Math.max(CHUVA_MINIMA_DA_ESCALA, ...previsao.map((dia) => dia.chuvaMm))
  const chuvaDaSemana = previsao.reduce((soma, dia) => soma + dia.chuvaMm, 0)
  const chuvaIdeal =
    limites?.chuvaSemanaMinMm != null && limites.chuvaSemanaMaxMm != null
      ? ` (o ideal é de ${numero(limites.chuvaSemanaMinMm)} a ${numero(limites.chuvaSemanaMaxMm)} mm)`
      : ''

  return (
    <>
      <S.Grafico aria-label="Próximos 7 dias">
        {previsao.map((dia, i) => {
          const Icone = ICONE_DO_TEMPO[dia.condicao]
          return (
            <S.DiaNoGrafico
              key={dia.data}
              $nivel={dia.nivel}
              $emFoco={dia.data === diaEmFoco}
              aria-current={dia.data === diaEmFoco ? 'date' : undefined}
            >
              <strong>{diaCurto(dia.data)}</strong>
              <S.DataNoGrafico>{diaEMes(dia.data)}</S.DataNoGrafico>
              <S.IconeDoTempo $cor={COR_DO_TEMPO[dia.condicao]} $condicao={dia.condicao} $dia={i}>
                <Icone
                  size={tema.icone.tempoNoCartao}
                  role="img"
                  aria-label={NOME_DO_TEMPO[dia.condicao]}
                />
              </S.IconeDoTempo>
              <S.Termometro>
                <S.Escala>
                  {ideal && (
                    <S.FaixaIdeal
                      aria-hidden
                      style={{ top: `${y(ideal.max)}%`, bottom: `${100 - y(ideal.min)}%` }}
                    />
                  )}
                  {calor !== null && (
                    <S.Limite aria-hidden $tipo="calor" style={{ top: `${y(calor)}%` }} />
                  )}
                  {frio !== null && (
                    <S.Limite aria-hidden $tipo="frio" style={{ top: `${y(frio)}%` }} />
                  )}
                  <S.Capsula
                    aria-hidden
                    style={{ top: `${y(dia.maxC)}%`, bottom: `${100 - y(dia.minC)}%` }}
                  />
                  <S.Maxima style={{ top: `${y(dia.maxC)}%` }}>
                    <SoParaLeitor>Máxima de </SoParaLeitor>
                    {Math.round(dia.maxC)}°
                  </S.Maxima>
                  <S.Minima style={{ top: `${y(dia.minC)}%` }}>
                    <SoParaLeitor>, mínima de </SoParaLeitor>
                    {Math.round(dia.minC)}°
                  </S.Minima>
                </S.Escala>
              </S.Termometro>
              <S.ChuvaNoGrafico aria-hidden>
                <S.BarraDeChuva style={{ height: `${(dia.chuvaMm / escalaDaChuva) * 100}%` }} />
              </S.ChuvaNoGrafico>
              <S.Chuva>
                <Chuva milimetros={dia.chuvaMm} />
              </S.Chuva>
              {dia.nivel === 'ok' ? (
                <SoParaLeitor>{dia.frase}</SoParaLeitor>
              ) : (
                <S.FraseDoDia $nivel={dia.nivel}>{dia.frase}</S.FraseDoDia>
              )}
            </S.DiaNoGrafico>
          )
        })}
      </S.Grafico>
      <S.Legenda aria-label="Como ler o gráfico">
        {ideal && (
          <li>
            <S.AmostraDaFaixa aria-hidden />
            Média ideal do dia: {numero(ideal.min)} a {numero(ideal.max)} °C
          </li>
        )}
        {calor !== null && (
          <li>
            <S.AmostraDoLimite aria-hidden $tipo="calor" />
            Calor forte acima de {numero(calor)} °C
          </li>
        )}
        {frio !== null && (
          <li>
            <S.AmostraDoLimite aria-hidden $tipo="frio" />
            Frio forte abaixo de {numero(frio)} °C
          </li>
        )}
        <li>
          <S.AmostraDaChuva aria-hidden />
          Chuva na semana: {numero(chuvaDaSemana)} mm{chuvaIdeal}
        </li>
      </S.Legenda>
    </>
  )
}
