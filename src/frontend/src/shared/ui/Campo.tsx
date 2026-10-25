import { CircleAlert } from 'lucide-react'
import { useId, type InputHTMLAttributes } from 'react'
import { useTheme } from 'styled-components'
import * as S from './Campo.styles'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string
  opcional?: boolean
  dica?: string
  erro?: string
}

// Rótulo, campo, erro e dica, já ligados entre si para o leitor de tela.
export function Campo({ rotulo, opcional, dica, erro, ...entrada }: Props) {
  const id = useId()
  const tema = useTheme()
  const idDoErro = `${id}-erro`
  const idDaDica = `${id}-dica`
  const descricao = [erro && idDoErro, dica && idDaDica].filter(Boolean).join(' ')

  return (
    <S.Grupo>
      <S.Rotulo htmlFor={id}>
        {rotulo}
        {opcional && <S.Opcional> (opcional)</S.Opcional>}
      </S.Rotulo>
      <S.Entrada
        id={id}
        aria-invalid={erro ? true : undefined}
        aria-describedby={descricao || undefined}
        $comErro={Boolean(erro)}
        {...entrada}
      />
      {erro && (
        <S.Erro id={idDoErro}>
          <CircleAlert size={tema.icone.erroDoCampo} aria-hidden />
          {erro}
        </S.Erro>
      )}
      {dica && <S.Dica id={idDaDica}>{dica}</S.Dica>}
    </S.Grupo>
  )
}
