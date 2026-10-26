import { ChevronRight } from 'lucide-react'
import { useTheme } from 'styled-components'
import { ICONE_DO_NIVEL, NIVEL } from '../../../shared/ui/nivel'
import type { LavouraNoPainel } from '../tipos'
import * as S from './CartaoDaLavoura.styles'

// "Dia 45 de 120" com a barrinha do ciclo ao lado; nas perenes, "Safra 2026/27".
function Andamento({ lavoura }: { lavoura: LavouraNoPainel }) {
  const { diaAtual, cicloDias, safra } = lavoura

  if (diaAtual !== null && cicloDias !== null) {
    const feito = Math.min(100, Math.round((diaAtual / cicloDias) * 100))
    return (
      <S.Andamento>
        Dia {diaAtual} de {cicloDias}
        <S.Barra role="img" aria-label={`${feito}% do ciclo concluído`}>
          <S.Preenchida style={{ width: `${feito}%` }} />
        </S.Barra>
      </S.Andamento>
    )
  }
  if (safra) return <S.Andamento>Safra {safra}</S.Andamento>
  return null
}

// O essencial de cada lavoura: o nome, a cultura, o aviso da semana e em que ponto do ciclo ela
// está, com a fase. O resto (a previsão, o que fazer, o histórico) fica na página da lavoura.
export function CartaoDaLavoura({ lavoura }: { lavoura: LavouraNoPainel }) {
  const tema = useTheme()
  const nivel = NIVEL[lavoura.aviso.severidade]
  const Icone = ICONE_DO_NIVEL[nivel]

  return (
    <S.Cartao to={`/lavouras/${lavoura.id}`}>
      <S.Textos>
        <S.Titulo>
          <S.Nome>{lavoura.apelido}</S.Nome>
          <S.Cultura>{lavoura.cultura}</S.Cultura>
        </S.Titulo>
        {lavoura.fase && <S.Fase>{lavoura.fase}</S.Fase>}
        <S.Selo $nivel={nivel}>
          <Icone size={tema.icone.selo} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
          {lavoura.aviso.mensagem}
        </S.Selo>
        <Andamento lavoura={lavoura} />
      </S.Textos>
      <ChevronRight size={tema.icone.seta} aria-hidden />
    </S.Cartao>
  )
}
