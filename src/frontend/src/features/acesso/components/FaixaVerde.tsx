import type { ReactNode } from 'react'
import * as S from './FaixaVerde.styles'
import { PadraoDeLavoura } from './PadraoDeLavoura'

export function FaixaVerde({
  children,
  comMarcador,
}: {
  children: ReactNode
  comMarcador?: boolean
}) {
  return (
    <S.Faixa>
      <PadraoDeLavoura comMarcador={comMarcador} />
      <S.Conteudo>{children}</S.Conteudo>
    </S.Faixa>
  )
}
