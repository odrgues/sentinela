import { useTheme } from 'styled-components'
import { diaCurto, diaEMes } from '../../../../shared/formato/data'
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

function chuva(milimetros: number) {
  return milimetros === 0 ? 'Sem chuva' : `${milimetros.toLocaleString('pt-BR')} mm de chuva`
}

function Tempo({ condicao, tamanho }: { condicao: Condicao; tamanho: number }) {
  const Icone = ICONE_DO_TEMPO[condicao]
  return (
    <S.IconeDoTempo $cor={COR_DO_TEMPO[condicao]}>
      <Icone size={tamanho} role="img" aria-label={NOME_DO_TEMPO[condicao]} />
    </S.IconeDoTempo>
  )
}

function Temperaturas({ dia }: { dia: DiaDePrevisao }) {
  return (
    <S.Temperaturas>
      <strong>{Math.round(dia.maxC)}°</strong> <span>{Math.round(dia.minC)}°</span>
    </S.Temperaturas>
  )
}

// Os 7 dias a partir de hoje: em lista no celular, em cartões no computador.
export function PrevisaoDaSemana({
  previsao,
  emCartoes,
}: {
  previsao: DiaDePrevisao[]
  emCartoes: boolean
}) {
  const tema = useTheme()

  if (emCartoes) {
    return (
      <S.GradeDeDias aria-label="Próximos 7 dias">
        {previsao.map((dia) => (
          <S.DiaNaGrade key={dia.data} $nivel={dia.nivel}>
            <strong>{diaCurto(dia.data)}</strong>
            <S.Chuva>{diaEMes(dia.data)}</S.Chuva>
            <Tempo condicao={dia.condicao} tamanho={tema.icone.tempoNoCartao} />
            <Temperaturas dia={dia} />
            <S.Chuva>{chuva(dia.chuvaMm)}</S.Chuva>
            <S.FraseDoDia $nivel={dia.nivel}>{dia.frase}</S.FraseDoDia>
          </S.DiaNaGrade>
        ))}
      </S.GradeDeDias>
    )
  }

  return (
    <S.ListaDeDias aria-label="Próximos 7 dias">
      {previsao.map((dia) => (
        <S.DiaNaLista key={dia.data}>
          <S.QuandoNaLista>
            <strong>{diaCurto(dia.data)}</strong>
            <span>{diaEMes(dia.data)}</span>
          </S.QuandoNaLista>
          <Tempo condicao={dia.condicao} tamanho={tema.icone.tempoNaLista} />
          <S.ComoVaiSer>
            <S.FraseDoDia $nivel={dia.nivel}>{dia.frase}</S.FraseDoDia>
            <S.Chuva>{chuva(dia.chuvaMm)}</S.Chuva>
          </S.ComoVaiSer>
          <Temperaturas dia={dia} />
        </S.DiaNaLista>
      ))}
    </S.ListaDeDias>
  )
}
