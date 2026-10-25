import { useSyncExternalStore } from 'react'
import { tema } from '../../styles/tema'

// A mesma quebra do noComputador do styles/midia.ts, para quando a tela muda o que mostra,
// e não só o estilo: no celular a Nova lavoura tem dois passos, no computador uma tela só.
const CONSULTA = `not all and (max-width: ${tema.quebra.computador})`

function acompanhar(avisar: () => void) {
  const lista = window.matchMedia(CONSULTA)
  lista.addEventListener('change', avisar)
  return () => lista.removeEventListener('change', avisar)
}

function estaNoComputador() {
  return window.matchMedia(CONSULTA).matches
}

export function useNoComputador() {
  return useSyncExternalStore(acompanhar, estaNoComputador)
}
