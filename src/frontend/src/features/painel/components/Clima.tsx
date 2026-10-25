import { Cloud } from 'lucide-react'
import { useTheme } from 'styled-components'
import { ICONE_DO_TEMPO } from '../../../shared/ui/tempo'
import type { Painel } from '../tipos'
import * as S from './Painel.styles'

// "29° · Hoje em Uberaba · sol com poucas nuvens", na cidade da lavoura de aviso mais grave.
export function Clima({ hoje }: { hoje: Painel['hoje'] }) {
  const tema = useTheme()
  const Icone = ICONE_DO_TEMPO[hoje.condicao] ?? Cloud
  const quente = hoje.condicao === 'sol' || hoje.condicao === 'sol_nuvens'

  return (
    <S.Clima>
      <S.IconeDoClima $quente={quente}>
        <Icone size={tema.icone.clima} aria-hidden />
      </S.IconeDoClima>
      <div>
        {hoje.tempC !== null && <S.Temperatura>{Math.round(hoje.tempC)}°</S.Temperatura>}
        <S.OndeEComo>
          Hoje em {hoje.cidade} · {hoje.condicaoTexto}
        </S.OndeEComo>
      </div>
    </S.Clima>
  )
}
