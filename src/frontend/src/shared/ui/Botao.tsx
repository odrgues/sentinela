import type { ButtonHTMLAttributes } from 'react'
import type { LinkProps } from 'react-router'
import * as S from './Botao.styles'

type Variante = S.Variante

export function Botao({
  variante = 'principal',
  type = 'button',
  ...botao
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante }) {
  return <S.Botao type={type} $variante={variante} {...botao} />
}

// Um link com cara de botão: leva para outra tela.
export function BotaoLink({
  variante = 'principal',
  ...link
}: LinkProps & { variante?: Variante }) {
  return <S.BotaoLink $variante={variante} {...link} />
}
