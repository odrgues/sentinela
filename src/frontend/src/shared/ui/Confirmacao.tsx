import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import * as S from './Confirmacao.styles'
import type { NivelDoTema } from './nivel'

type Props = {
  titulo: string
  // Opcional: o quadradinho colorido com o ícone, no alto.
  icone?: ReactNode
  nivel: NivelDoTema
  // O texto embaixo do título.
  children: ReactNode
  // Os botões: confirmar, cancelar e o que mais a tela quiser.
  acoes: ReactNode
  aoFechar: () => void
}

// "Já colheu?", "Excluir a lavoura?": no celular sobe de baixo, no computador fica no meio.
// Fecha com Esc ou tocando fora, e devolve o foco para quem abriu.
export function Confirmacao({ titulo, icone, nivel, children, acoes, aoFechar }: Props) {
  const idDoTitulo = useId()
  const dialogo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const quemAbriu = document.activeElement as HTMLElement | null
    dialogo.current?.focus()

    function aoApertar(evento: KeyboardEvent) {
      if (evento.key === 'Escape') aoFechar()
    }
    document.addEventListener('keydown', aoApertar)
    return () => {
      document.removeEventListener('keydown', aoApertar)
      quemAbriu?.focus()
    }
  }, [aoFechar])

  return createPortal(
    <S.Veu
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar()
      }}
    >
      <S.Dialogo
        ref={dialogo}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idDoTitulo}
        tabIndex={-1}
      >
        <S.Alca aria-hidden />
        {icone && (
          <S.Icone $nivel={nivel} aria-hidden>
            {icone}
          </S.Icone>
        )}
        <S.Textos>
          <h2 id={idDoTitulo}>{titulo}</h2>
          {children}
        </S.Textos>
        <S.Acoes>{acoes}</S.Acoes>
      </S.Dialogo>
    </S.Veu>,
    document.body,
  )
}
