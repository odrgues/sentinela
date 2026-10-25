import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import * as S from './Mensagem.styles'

export const TEMPO_DA_MENSAGEM = 4000

// "Lavoura salva!", "Senha alterada…": aparece em cima da tela e some sozinha em 4 segundos.
export function Mensagem({ texto }: { texto: string }) {
  const tema = useTheme()
  const [visivel, setVisivel] = useState(true)

  useEffect(() => {
    const relogio = setTimeout(() => setVisivel(false), TEMPO_DA_MENSAGEM)
    return () => clearTimeout(relogio)
  }, [])

  if (!visivel) return null

  return (
    <S.Mensagem role="status">
      <Check size={tema.icone.aviso} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
      {texto}
    </S.Mensagem>
  )
}
