import { CircleAlert } from 'lucide-react'
import { useTheme } from 'styled-components'
import * as S from './AvisoDeErro.styles'

// O erro geral do formulário, em cima do botão: senha errada, sem internet, e-mail repetido.
export function AvisoDeErro({ titulo, texto }: { titulo: string; texto?: string }) {
  const tema = useTheme()

  return (
    <S.Caixa role="alert">
      <CircleAlert size={tema.icone.aviso} aria-hidden />
      <S.Textos>
        <S.Titulo>{titulo}</S.Titulo>
        {texto && <S.Texto>{texto}</S.Texto>}
      </S.Textos>
    </S.Caixa>
  )
}
