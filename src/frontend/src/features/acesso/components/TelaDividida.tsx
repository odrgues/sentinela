import type { ReactNode } from 'react'
import * as S from './TelaDividida.styles'

type Props = {
  // A faixa verde do computador, ao lado do formulário.
  faixa: ReactNode
  // No celular a faixa some, e cada tela põe no alto o que precisa.
  topoNoCelular: ReactNode
  children: ReactNode
}

// Login e cadastro: a faixa verde de um lado e o formulário do outro.
export function TelaDividida({ faixa, topoNoCelular, children }: Props) {
  return (
    <S.Tela>
      <S.LadoDaFaixa>{faixa}</S.LadoDaFaixa>
      <S.TopoNoCelular>{topoNoCelular}</S.TopoNoCelular>
      <S.LadoDoFormulario>
        <S.Coluna>{children}</S.Coluna>
      </S.LadoDoFormulario>
    </S.Tela>
  )
}
