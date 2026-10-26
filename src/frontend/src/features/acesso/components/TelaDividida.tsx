import type { ReactNode } from 'react'
import { Logo } from '../../../shared/ui/Logo'
import { FaixaComFoto } from './FaixaComFoto'
import * as S from './TelaDividida.styles'

// Login, cadastro e esqueci a senha: um cartão no meio da tela, com o formulário à esquerda e a
// foto das folhas à direita. No celular, a foto vira uma faixa fina no alto.
export function TelaDividida({ children }: { children: ReactNode }) {
  return (
    <S.Tela>
      <S.Cartao>
        <S.LadoDoFormulario>
          <S.Coluna>
            <S.LogoDoFormulario>
              <Logo />
            </S.LogoDoFormulario>
            {children}
          </S.Coluna>
        </S.LadoDoFormulario>
        <S.LadoDaFoto>
          <FaixaComFoto />
        </S.LadoDaFoto>
      </S.Cartao>
    </S.Tela>
  )
}
