import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { chamarApi } from '../../shared/api/cliente'
import type { ErroApi } from '../../shared/api/erros'
import type { Severidade } from '../../shared/ui/nivel'
import type { Cultivo, DetalheDaLavoura, Local, PaginaDoHistorico } from './tipos'

export type NovoCultivo = Local & {
  culturaId: number
  apelido: string
  dataPlantio: string
  areaHa?: number
}

// Salva e volta para o painel, que mostra "Lavoura salva!" e já pede os avisos de novo.
export function useCriarLavoura() {
  const navegar = useNavigate()
  const clienteDeConsultas = useQueryClient()

  return useMutation<Cultivo, ErroApi, NovoCultivo>({
    mutationFn: (dados) => chamarApi<Cultivo>('cultivos', { metodo: 'POST', corpo: dados }),
    onSuccess: () => {
      clienteDeConsultas.invalidateQueries({ queryKey: ['painel'] })
      navegar('/', { state: { mensagem: 'Lavoura salva!' } })
    },
  })
}

export function useLavoura(id: string) {
  return useQuery<DetalheDaLavoura, ErroApi>({
    queryKey: ['lavoura', id],
    queryFn: () => chamarApi<DetalheDaLavoura>(`cultivos/${id}`),
  })
}

// O histórico vem de 20 em 20; "Ver mais avisos" pede a próxima página.
export function useHistorico(id: string, severidade: Severidade | null) {
  return useInfiniteQuery<PaginaDoHistorico, ErroApi>({
    queryKey: ['historico', id, severidade],
    queryFn: ({ pageParam }) =>
      chamarApi<PaginaDoHistorico>(`cultivos/${id}/alertas`, {
        parametros: { severidade: severidade ?? undefined, pagina: pageParam as number },
      }),
    initialPageParam: 0,
    getNextPageParam: ({ pagina, tamanho, total }) =>
      (pagina + 1) * tamanho < total ? pagina + 1 : undefined,
  })
}

export const MENSAGEM_DO_STATUS = {
  colhido: 'Colheita registrada. O histórico fica guardado.',
  perdido: 'Lavoura marcada como perdida. O histórico fica guardado.',
}

// "Já colhi" ou "A lavoura foi perdida": a lavoura sai do painel e para de receber avisos.
export function useEncerrarLavoura(id: string) {
  const navegar = useNavigate()
  const clienteDeConsultas = useQueryClient()

  return useMutation<Cultivo, ErroApi, 'colhido' | 'perdido'>({
    mutationFn: (status) =>
      chamarApi<Cultivo>(`cultivos/${id}`, { metodo: 'PATCH', corpo: { status } }),
    onSuccess: (_, status) => {
      clienteDeConsultas.invalidateQueries({ queryKey: ['painel'] })
      clienteDeConsultas.invalidateQueries({ queryKey: ['lavoura', id] })
      navegar('/', { state: { mensagem: MENSAGEM_DO_STATUS[status] } })
    },
  })
}

// Só os campos que mudaram. Mudar a cultura ou a data faz o backend refazer a colheita
// prevista e os avisos.
export type MudancasNaLavoura = Partial<Omit<NovoCultivo, 'areaHa'>> & { areaHa?: number | null }

export function useEditarLavoura(id: string) {
  const navegar = useNavigate()
  const clienteDeConsultas = useQueryClient()

  return useMutation<Cultivo, ErroApi, MudancasNaLavoura>({
    mutationFn: (mudancas) =>
      chamarApi<Cultivo>(`cultivos/${id}`, { metodo: 'PATCH', corpo: mudancas }),
    onSuccess: () => {
      clienteDeConsultas.invalidateQueries({ queryKey: ['painel'] })
      clienteDeConsultas.invalidateQueries({ queryKey: ['lavoura', id] })
      clienteDeConsultas.invalidateQueries({ queryKey: ['historico', id] })
      navegar(`/lavouras/${id}`, { state: { mensagem: 'Alterações salvas' } })
    },
  })
}

export function useExcluirLavoura(id: string) {
  const navegar = useNavigate()
  const clienteDeConsultas = useQueryClient()

  return useMutation<void, ErroApi, void>({
    mutationFn: () => chamarApi<void>(`cultivos/${id}`, { metodo: 'DELETE' }),
    onSuccess: () => {
      clienteDeConsultas.removeQueries({ queryKey: ['lavoura', id] })
      clienteDeConsultas.invalidateQueries({ queryKey: ['painel'] })
      navegar('/', { state: { mensagem: 'Lavoura excluída' } })
    },
  })
}
