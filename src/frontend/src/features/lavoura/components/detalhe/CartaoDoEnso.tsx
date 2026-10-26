import { Waves } from 'lucide-react'
import { useTheme } from 'styled-components'
import { explicacaoDoEnso, tituloDoEnso } from '../../detalhe'
import type { Enso } from '../../tipos'
import * as S from './Detalhe.styles'

// O El Niño ou a La Niña do mês do plantio (ou do último mês medido, na perene), em linguagem
// simples: o que é, o que costuma acontecer e o que fazer. A explicação técnica fica no
// "Saiba mais".
export function CartaoDoEnso({ enso, perene }: { enso: Enso; perene: boolean }) {
  const tema = useTheme()

  return (
    <S.Enso>
      <Waves size={tema.icone.tempoNaLista} aria-hidden />
      <div>
        <strong>{tituloDoEnso(enso, perene)}</strong>
        <p>{explicacaoDoEnso(enso)}</p>
        {enso.efeito && (
          <S.EfeitoDoEnso>
            <strong>O que costuma acontecer</strong>
            {enso.efeito}
          </S.EfeitoDoEnso>
        )}
        {enso.oQueFazer && (
          <S.EfeitoDoEnso>
            <strong>O que fazer</strong>
            {enso.oQueFazer}
          </S.EfeitoDoEnso>
        )}
        <S.SaibaMais>
          <summary>Saiba mais</summary>
          <p>{enso.frase}</p>
        </S.SaibaMais>
        {enso.fonte && <S.Fonte>Fonte: {enso.fonte}</S.Fonte>}
      </div>
    </S.Enso>
  )
}
