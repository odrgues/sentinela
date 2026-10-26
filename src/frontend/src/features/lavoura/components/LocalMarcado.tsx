import { MapPin } from 'lucide-react'
import { useTheme } from 'styled-components'
import type { Local } from '../tipos'
import * as S from './LocalMarcado.styles'

// O município do ponto do mapa. O mapa fica sempre à vista: o local muda quando a pessoa mexe nele.
export function LocalMarcado({ local }: { local: Local | null }) {
  const tema = useTheme()

  return (
    <S.Cartao>
      <MapPin size={tema.icone.aviso} aria-hidden />
      <S.Textos>
        <S.Cidade>{local ? `${local.cidade} – ${local.uf}` : 'Nenhum local marcado'}</S.Cidade>
        <S.Explicacao>Muda sozinho quando você mexe no mapa</S.Explicacao>
      </S.Textos>
    </S.Cartao>
  )
}
