import { QueryClient } from '@tanstack/react-query'
import { erroPassageiro } from './erros'

// A previsão é atualizada poucas vezes por dia: 5 minutos sem pedir de novo não esconde nada.
const CINCO_MINUTOS = 5 * 60 * 1000

export function deveTentarDeNovo(falhas: number, erro: Error): boolean {
  return erroPassageiro(erro) && falhas < 2
}

export function criarClienteDeConsultas(esperaEntreTentativas?: number) {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CINCO_MINUTOS,
        retry: deveTentarDeNovo,
        ...(esperaEntreTentativas !== undefined && { retryDelay: esperaEntreTentativas }),
      },
    },
  })
}
