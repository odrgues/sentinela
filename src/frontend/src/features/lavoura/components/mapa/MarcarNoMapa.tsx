import type { ReactNode } from 'react'
import { mapaLigado } from '../../../../shared/mapa/mapa'
import type { Local, Ponto } from '../../tipos'
import { MapaDeSatelite } from './MapaDeSatelite'
import { MapaDesligado } from './MapaDesligado'

type Props = {
  // Recebe o ponto do meio do mapa com o município, ou null enquanto não dá para marcar.
  aoMudarLocal: (local: Local | null) => void
  // O que vai no cartão de cima (voltar, passo, título) e no de baixo (Confirmar local).
  topo?: ReactNode
  rodape?: ReactNode
  // Editar lavoura: o mapa abre no ponto já salvo.
  inicio?: Ponto
  // Nova lavoura: no computador, o mapa ocupa a tela toda embaixo do vidro com o formulário; e,
  // no computador e no celular, a busca e o "Usar minha localização" ficam compactos.
  telaCheia?: boolean
}

// O único lugar que decide entre o mapa e o aviso de mapa desligado (nos testes).
export function MarcarNoMapa(props: Props) {
  return mapaLigado() ? <MapaDeSatelite {...props} /> : <MapaDesligado {...props} />
}
