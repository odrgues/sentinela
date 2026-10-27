import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from 'styled-components'
import * as S from './Mensagem.styles'

export const TEMPO_DA_MENSAGEM = 4000

// "Lavoura salva!", "Senha alterada…": desce no alto da tela e some sozinha em 4 segundos. Vai direto
// no body, para ficar por cima de tudo, até da janela da Minha conta.
export function Mensagem({ texto }: { texto: string }) {
  const tema = useTheme()
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const relogio = setTimeout(() => setVisivel(false), TEMPO_DA_MENSAGEM)
    return () => clearTimeout(relogio)
  }, [])

  if (!visivel) return null

  return createPortal(
    <S.Mensagem role="status">
      <Check size={tema.icone.aviso} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
      {texto}
    </S.Mensagem>,
    document.body,
  )
}
