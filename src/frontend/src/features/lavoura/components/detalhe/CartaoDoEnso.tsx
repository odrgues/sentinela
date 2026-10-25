import { Waves } from 'lucide-react'
import { useTheme } from 'styled-components'
import { tituloDoEnso } from '../../detalhe'
import type { Enso } from '../../tipos'
import * as S from './Detalhe.styles'

// O El Niño ou a La Niña do mês do plantio (ou do último mês medido, na perene).
export function CartaoDoEnso({ enso, perene }: { enso: Enso; perene: boolean }) {
  const tema = useTheme()

  return (
    <S.Enso>
      <Waves size={tema.icone.tempoNaLista} aria-hidden />
      <div>
        <strong>{tituloDoEnso(enso, perene)}</strong>
        <p>{enso.frase}</p>
        {enso.efeito && <S.EfeitoDoEnso>{enso.efeito}</S.EfeitoDoEnso>}
        {enso.oQueFazer && (
          <S.EfeitoDoEnso>
            <strong>O que fazer</strong>
            {enso.oQueFazer}
          </S.EfeitoDoEnso>
        )}
        {enso.fonte && <S.Fonte>Fonte: {enso.fonte}</S.Fonte>}
      </div>
    </S.Enso>
  )
}
