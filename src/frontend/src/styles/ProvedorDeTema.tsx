import type { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { EstiloGlobal } from './EstiloGlobal'
import { tema } from './tema'

export function ProvedorDeTema({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={tema}>
      <EstiloGlobal />
      {children}
    </ThemeProvider>
  )
}
