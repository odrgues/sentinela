import { Droplet } from 'lucide-react'
import { useTheme } from 'styled-components'
import { diaCurto, diaEMes } from '../../../../shared/formato/data'
import { SoParaLeitor } from '../../../../shared/ui/SoParaLeitor'
import { ICONE_DO_TEMPO, NOME_DO_TEMPO, type Condicao } from '../../../../shared/ui/tempo'
import type { DiaDePrevisao } from '../../tipos'
import * as S from './Detalhe.styles'

const COR_DO_TEMPO: Record<Condicao, 'sol' | 'nuvem' | 'chuva'> = {
  sol: 'sol',
  sol_nuvens: 'sol',
  nublado: 'nuvem',
  chuva: 'chuva',
  tempestade: 'chuva',
}

// "3,5 mm" na coluna, que é estreita; o "de chuva" fica para o leitor de tela.
function Chuva({ milimetros }: { milimetros: number }) {
  if (milimetros === 0) return <>Sem chuva</>
  return (
    <>
      {milimetros.toLocaleString('pt-BR')} mm<SoParaLeitor> de chuva</SoParaLeitor>
    </>
  )
}

// A altura de cada máxima na faixa da linha, em % de cima para baixo: a mais quente fica no alto.
function alturas(previsao: DiaDePrevisao[]) {
  const maximas = previsao.map((dia) => dia.maxC)
  const maior = Math.max(...maximas)
  const menor = Math.min(...maximas)
  return maximas.map((maxima) =>
    maior === menor ? 50 : 15 + ((maior - maxima) / (maior - menor)) * 70,
  )
}

// O pedaço da linha de cada dia: do meio do caminho com o dia de antes até o meio do caminho com
// o de depois. Juntos, os pedaços formam a linha da semana.
function pedacoDaLinha(y: number[], i: number) {
  const pontos = [`50,${y[i]}`]
  if (i > 0) pontos.unshift(`0,${(y[i - 1] + y[i]) / 2}`)
  if (i < y.length - 1) pontos.push(`100,${(y[i] + y[i + 1]) / 2}`)
  return pontos.join(' ')
}

// Os 7 dias a partir de hoje num gráfico, como no app do tempo: um dia por coluna, com o ícone,
// a máxima numa linha que liga os dias, a mínima, a chuva e o que o dia significa para a lavoura.
export function PrevisaoDaSemana({ previsao }: { previsao: DiaDePrevisao[] }) {
  const tema = useTheme()
  const y = alturas(previsao)

  return (
    <S.Grafico aria-label="Próximos 7 dias">
      {previsao.map((dia, i) => {
        const Icone = ICONE_DO_TEMPO[dia.condicao]
        return (
          <S.DiaNoGrafico key={dia.data} $nivel={dia.nivel}>
            <strong>{diaCurto(dia.data)}</strong>
            <S.Chuva>{diaEMes(dia.data)}</S.Chuva>
            <S.IconeDoTempo $cor={COR_DO_TEMPO[dia.condicao]}>
              <Icone
                size={tema.icone.tempoNoCartao}
                role="img"
                aria-label={NOME_DO_TEMPO[dia.condicao]}
              />
            </S.IconeDoTempo>
            <S.Maxima>{Math.round(dia.maxC)}°</S.Maxima>
            <S.Trilha aria-hidden>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline
                  points={pedacoDaLinha(y, i)}
                  fill="none"
                  stroke={tema.cores.grafico.linha}
                  strokeWidth={tema.tracoDoIcone.forte}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <S.Ponto $nivel={dia.nivel} style={{ top: `${y[i]}%` }} />
            </S.Trilha>
            <S.Minima>{Math.round(dia.minC)}°</S.Minima>
            <S.Chuva>
              <Droplet size={tema.icone.selo} aria-hidden />
              <Chuva milimetros={dia.chuvaMm} />
            </S.Chuva>
            <S.FraseDoDia $nivel={dia.nivel}>{dia.frase}</S.FraseDoDia>
          </S.DiaNoGrafico>
        )
      })}
    </S.Grafico>
  )
}
