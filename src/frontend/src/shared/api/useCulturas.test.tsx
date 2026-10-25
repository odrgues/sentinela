import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { culturas } from '../../mocks/dados/culturas'
import { servidor } from '../../mocks/servidor'
import { criarClienteDeConsultas } from './consultas'
import { MENSAGENS } from './erros'
import { useCulturas } from './useCulturas'

function renderizarUseCulturas() {
  const cliente = criarClienteDeConsultas(0)
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={cliente}>{children}</QueryClientProvider>
  )
  return renderHook(() => useCulturas(), { wrapper })
}

function contarChamadas(status: number, corpo: object) {
  const chamadas = { total: 0 }
  servidor.use(
    http.get('/api/culturas', () => {
      chamadas.total++
      return HttpResponse.json(corpo, { status })
    }),
  )
  return chamadas
}

describe('useCulturas', () => {
  it('entrega as culturas quando a API responde', async () => {
    const { result } = renderizarUseCulturas()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(culturas)
  })

  it('não repete a chamada num 4xx', async () => {
    const chamadas = contarChamadas(401, { mensagem: 'Entre de novo' })

    const { result } = renderizarUseCulturas()

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Entre de novo')
    expect(chamadas.total).toBe(1)
  })

  it('tenta mais duas vezes quando o servidor falha', async () => {
    const chamadas = contarChamadas(500, {})

    const { result } = renderizarUseCulturas()

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe(MENSAGENS.servidor)
    expect(chamadas.total).toBe(3)
  })
})
