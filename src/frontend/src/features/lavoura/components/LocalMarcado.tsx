import { MapPin } from 'lucide-react'
import { useTheme } from 'styled-components'
import type { Local } from '../tipos'
import * as S from './LocalMarcado.styles'

type Props = {
  local: Local | null
  // No celular, volta para o passo do mapa.
  aoTrocar?: () => void
}

export function LocalMarcado({ local, aoTrocar }: Props) {
  const tema = useTheme()

  return (
    <S.Cartao>
      <MapPin size={tema.icone.aviso} aria-hidden />
      <S.Textos>
        <S.Cidade>{local ? `${local.cidade} – ${local.uf}` : 'Nenhum local marcado'}</S.Cidade>
        <S.Explicacao>
          {aoTrocar ? 'Local marcado no mapa' : 'Muda sozinho quando você mexe no mapa'}
        </S.Explicacao>
      </S.Textos>
      {aoTrocar && (
        <S.Trocar type="button" onClick={aoTrocar} aria-label="Trocar o local no mapa">
          Trocar
        </S.Trocar>
      )}
    </S.Cartao>
  )
}
