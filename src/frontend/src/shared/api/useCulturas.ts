import { useQuery } from '@tanstack/react-query'
import { chamarApi } from './cliente'
import type { ErroApi } from './erros'
import type { Cultura } from './tipos/cultura'

// Usado em "O que você plantou" e em "Editar lavoura".
export function useCulturas() {
  return useQuery<Cultura[], ErroApi>({
    queryKey: ['culturas'],
    queryFn: () => chamarApi<Cultura[]>('culturas'),
  })
}
