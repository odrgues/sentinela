import { ChevronRight } from 'lucide-react'
import { useTheme } from 'styled-components'
import { ICONE_DO_NIVEL, NIVEL } from '../../../shared/ui/nivel'
import { andamento } from '../textos'
import type { LavouraNoPainel } from '../tipos'
import * as S from './CartaoDaLavoura.styles'

export function CartaoDaLavoura({ lavoura }: { lavoura: LavouraNoPainel }) {
  const tema = useTheme()
  const nivel = NIVEL[lavoura.aviso.severidade]
  const Icone = ICONE_DO_NIVEL[nivel]

  return (
    <S.Cartao to={`/lavouras/${lavoura.id}`}>
      <S.Bolinha $nivel={nivel} aria-hidden />
      <S.Textos>
        <S.Nome>{lavoura.apelido}</S.Nome>
        <S.Andamento>{andamento(lavoura)}</S.Andamento>
        <S.Selo $nivel={nivel}>
          <Icone size={tema.icone.selo} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
          {lavoura.aviso.mensagem}
        </S.Selo>
      </S.Textos>
      <ChevronRight size={tema.icone.seta} aria-hidden />
    </S.Cartao>
  )
}
