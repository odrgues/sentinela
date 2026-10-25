import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { criarClienteDeConsultas } from '../shared/api/consultas'
import { ProvedorDeTema } from '../styles/ProvedorDeTema'
import { rotas } from './rotas/rotas'

export function App() {
  const [clienteDeConsultas] = useState(() => criarClienteDeConsultas())
  const [roteador] = useState(() => createBrowserRouter(rotas))

  return (
    <QueryClientProvider client={clienteDeConsultas}>
      <ProvedorDeTema>
        <RouterProvider router={roteador} />
      </ProvedorDeTema>
    </QueryClientProvider>
  )
}
