import * as S from './FaixaComFoto.styles'

// A foto das folhas das telas de acesso: a metade direita do cartão, ou a faixa do alto no celular.
// É só enfeite, por isso fica escondida dos leitores de tela.
export function FaixaComFoto() {
  return <S.Foto aria-hidden />
}
