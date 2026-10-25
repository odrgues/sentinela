import { ChevronLeft } from 'lucide-react'
import { useTheme } from 'styled-components'
import * as S from './Voltar.styles'

export type Destino = { rotulo: string } & ({ para: string } | { aoClicar: () => void })

// A seta de voltar: um link para outra tela, ou um botão que volta um passo na mesma tela.
export function Voltar(destino: Destino) {
  const tema = useTheme()
  const seta = <ChevronLeft size={tema.icone.topo} aria-hidden />

  if ('para' in destino) {
    return (
      <S.VoltarLink to={destino.para} aria-label={destino.rotulo}>
        {seta}
      </S.VoltarLink>
    )
  }
  return (
    <S.VoltarBotao type="button" onClick={destino.aoClicar} aria-label={destino.rotulo}>
      {seta}
    </S.VoltarBotao>
  )
}
