import { Sprout } from 'lucide-react'
import { useTheme } from 'styled-components'
import type { FaseDoCiclo as Fase } from '../../tipos'
import * as S from './Detalhe.styles'

// "Floração · dias 35 a 50" e o que a lavoura pede nessa fase, com a fonte.
export function FaseDoCiclo({ fase }: { fase: Fase }) {
  const tema = useTheme()

  return (
    <S.Fase>
      <Sprout size={tema.icone.tempoNaLista} aria-hidden />
      <div>
        <strong>
          {fase.nome} · dias {fase.diaInicio} a {fase.diaFim}
        </strong>
        <p>{fase.orientacao}</p>
        <S.Fonte>Fonte: {fase.fonte}</S.Fonte>
      </div>
    </S.Fase>
  )
}
