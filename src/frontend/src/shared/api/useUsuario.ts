import { useQuery } from '@tanstack/react-query'
import { chamarApi } from './cliente'
import type { ErroApi } from './erros'
import type { Usuario } from './tipos/usuario'

// Quem entrou: o nome na barra do topo e os dados da Minha conta.
export function useUsuario() {
  return useQuery<Usuario, ErroApi>({
    queryKey: ['usuario'],
    queryFn: () => chamarApi<Usuario>('usuario/me'),
  })
}
