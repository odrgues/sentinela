import { useEffect, type ReactNode } from 'react'
import type { Local, Ponto } from '../../tipos'
import { LOCAL_DE_EXEMPLO } from './localDeExemplo'
import * as S from './Mapa.styles'
import { Marcador } from './Marcador'

type Props = {
  aoMudarLocal: (local: Local | null) => void
  topo?: ReactNode
  rodape?: ReactNode
  inicio?: Ponto
  telaCheia?: boolean
}

// Nos testes não tem mapa: a lavoura fica no ponto de exemplo, para o resto da tela funcionar.
// Na edição (com inicio), não marca nada: a lavoura continua no ponto salvo.
export function MapaDesligado({ aoMudarLocal, topo, rodape, inicio, telaCheia = false }: Props) {
  const temInicio = inicio !== undefined

  useEffect(() => {
    if (temInicio) return
    aoMudarLocal(LOCAL_DE_EXEMPLO)
  }, [aoMudarLocal, temInicio])

  return (
    <S.Area $telaCheia={telaCheia}>
      <S.SemMapa>
        <p>
          <strong>Mapa desligado</strong>
          Enquanto isso, a lavoura fica marcada em Uberaba – MG.
        </p>
      </S.SemMapa>
      {topo && <S.CartaoDeCima $telaCheia={telaCheia}>{topo}</S.CartaoDeCima>}
      <Marcador />
      {rodape && <S.CartaoDeBaixo $telaCheia={telaCheia}>{rodape}</S.CartaoDeBaixo>}
    </S.Area>
  )
}
