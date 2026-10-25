import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'
import { servidor } from '../mocks/servidor'
import { telaDeCelular } from './tela'

// Com todos os arquivos rodando juntos, salvar e mudar de tela pode passar de 1 segundo.
configure({ asyncUtilTimeout: 3000 })

beforeAll(() => {
  servidor.listen({ onUnhandledRequest: 'error' })
})

beforeEach(() => {
  telaDeCelular()
})

afterEach(() => {
  cleanup()
  servidor.resetHandlers()
  localStorage.clear()
})

afterAll(() => {
  servidor.close()
})
