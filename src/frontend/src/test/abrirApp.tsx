import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createMemoryRouter, type InitialEntry } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { rotas } from '../app/rotas/rotas'
import { criarClienteDeConsultas } from '../shared/api/consultas'
import { ProvedorDeTema } from '../styles/ProvedorDeTema'

export function abrirApp(caminho: InitialEntry) {
  const roteador = createMemoryRouter(rotas, { initialEntries: [caminho] })
  render(
    <QueryClientProvider client={criarClienteDeConsultas(0)}>
      <ProvedorDeTema>
        <RouterProvider router={roteador} />
      </ProvedorDeTema>
    </QueryClientProvider>,
  )
  return roteador
}
