import { useQuery } from '@tanstack/react-query'
import { chamarApi } from '../../shared/api/cliente'
import type { ErroApi } from '../../shared/api/erros'
import type { Painel } from './tipos'

export function usePainel() {
  return useQuery<Painel, ErroApi>({
    queryKey: ['painel'],
    queryFn: () => chamarApi<Painel>('painel'),
  })
}
