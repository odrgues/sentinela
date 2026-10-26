import { useEffect, type ReactNode } from 'react'
import type { Local } from '../../tipos'
import { LOCAL_DE_EXEMPLO } from './localDeExemplo'
import * as S from './Mapa.styles'
import { Marcador } from './Marcador'

type Props = {
  aoMudarLocal: (local: Local | null) => void
  topo?: ReactNode
  rodape?: ReactNode
  telaCheia?: boolean
}

// Sem VITE_GOOGLE_MAPS_KEY não tem mapa. Em desenvolvimento e nos testes, a lavoura fica no
// ponto de exemplo, para o resto da tela funcionar. No build de produção, não marca nada.
export function MapaSemChave({ aoMudarLocal, topo, rodape, telaCheia = false }: Props) {
  const emDesenvolvimento = import.meta.env.DEV

  useEffect(() => {
    aoMudarLocal(emDesenvolvimento ? LOCAL_DE_EXEMPLO : null)
  }, [aoMudarLocal, emDesenvolvimento])

  return (
    <S.Area $telaCheia={telaCheia}>
      <S.SemMapa>
        <p>
          <strong>Mapa desligado</strong>
          {emDesenvolvimento
            ? 'Falta a chave do Google Maps (VITE_GOOGLE_MAPS_KEY). Enquanto isso, a lavoura fica marcada em Uberaba – MG.'
            : 'O mapa não carregou. Tente de novo mais tarde.'}
        </p>
      </S.SemMapa>
      {topo && <S.CartaoDeCima $telaCheia={telaCheia}>{topo}</S.CartaoDeCima>}
      <Marcador />
      {rodape && <S.CartaoDeBaixo $telaCheia={telaCheia}>{rodape}</S.CartaoDeBaixo>}
    </S.Area>
  )
}
