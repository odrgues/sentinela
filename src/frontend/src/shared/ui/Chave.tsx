import { useId } from 'react'
import * as S from './Chave.styles'

type Props = {
  rotulo: string
  explicacao?: string
  ligada: boolean
  aoMudar: (ligada: boolean) => void
}

// Uma chave de ligar e desligar, com o rótulo e a explicação do lado.
export function Chave({ rotulo, explicacao, ligada, aoMudar }: Props) {
  const id = useId()

  return (
    <S.Linha>
      <S.Textos>
        <strong id={`${id}-rotulo`}>{rotulo}</strong>
        {explicacao && <span id={`${id}-explicacao`}>{explicacao}</span>}
      </S.Textos>
      <S.Trilho
        type="button"
        role="switch"
        aria-checked={ligada}
        aria-labelledby={`${id}-rotulo`}
        aria-describedby={explicacao ? `${id}-explicacao` : undefined}
        onClick={() => aoMudar(!ligada)}
      />
    </S.Linha>
  )
}
