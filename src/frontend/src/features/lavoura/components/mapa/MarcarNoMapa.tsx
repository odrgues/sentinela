import type { ReactNode } from 'react'
import { chaveDoGoogle } from '../../../../shared/mapa/chave'
import type { Local, Ponto } from '../../tipos'
import { MapaDoGoogle } from './MapaDoGoogle'
import { MapaSemChave } from './MapaSemChave'

type Props = {
  // Recebe o ponto do meio do mapa com o município, ou null enquanto não dá para marcar.
  aoMudarLocal: (local: Local | null) => void
  // O que vai no cartão de cima (voltar, passo, título) e no de baixo (Confirmar local).
  topo?: ReactNode
  rodape?: ReactNode
  // Editar lavoura: o mapa abre no ponto já salvo.
  inicio?: Ponto
  // Nova lavoura no computador: o mapa ocupa a tela toda, embaixo do vidro com o formulário.
  telaCheia?: boolean
}

// O único lugar que decide entre o mapa do Google e o aviso de mapa desligado.
export function MarcarNoMapa(props: Props) {
  const chave = chaveDoGoogle()
  return chave ? <MapaDoGoogle chave={chave} {...props} /> : <MapaSemChave {...props} />
}
