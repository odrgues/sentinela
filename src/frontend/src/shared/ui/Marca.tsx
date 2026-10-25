import { Sprout } from 'lucide-react'
import { useTheme } from 'styled-components'
import * as S from './Marca.styles'

type Props = {
  sobreVerde?: boolean
  grande?: boolean
}

// O broto e o nome. Na faixa verde, o broto fica amarelo e o nome branco.
export function Marca({ sobreVerde = false, grande = false }: Props) {
  const tema = useTheme()

  return (
    <S.Marca $sobreVerde={sobreVerde} $grande={grande}>
      <Sprout size={grande ? tema.icone.marca : tema.icone.marcaNoTopo} aria-hidden />
      Sentinela
    </S.Marca>
  )
}
