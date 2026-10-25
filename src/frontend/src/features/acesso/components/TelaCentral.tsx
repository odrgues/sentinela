import type { ReactNode } from 'react'
import * as S from './TelaCentral.styles'

// Esqueci a senha e nova senha: as telas que só têm a versão do celular.
export function TelaCentral({ children }: { children: ReactNode }) {
  return (
    <S.Tela>
      <S.Cartao>{children}</S.Cartao>
    </S.Tela>
  )
}
