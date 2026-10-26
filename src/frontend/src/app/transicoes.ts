import type { DataRouter, RouterNavigateOptions, To } from 'react-router'

// Liga a transição de página (View Transitions do navegador) em toda navegação: links, botões e
// redirecionamentos, sem precisar marcar cada um. O efeito em si (a página que sai some e a nova
// sobe de leve) está no EstiloGlobal. Voltar e avançar do navegador trocam a página sem efeito.
// Em navegador sem suporte (e nos testes), não muda nada.
export function comTransicoes(roteador: DataRouter) {
  if (typeof document === 'undefined' || !('startViewTransition' in document)) return roteador

  const navegar = roteador.navigate.bind(roteador)
  function navegarComTransicao(destino: number): Promise<void>
  function navegarComTransicao(destino: To | null, opcoes?: RouterNavigateOptions): Promise<void>
  function navegarComTransicao(destino: number | To | null, opcoes?: RouterNavigateOptions) {
    if (typeof destino === 'number') return navegar(destino)
    return navegar(destino, { ...opcoes, viewTransition: opcoes?.viewTransition ?? true })
  }
  roteador.navigate = navegarComTransicao
  return roteador
}
