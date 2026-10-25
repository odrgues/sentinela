import type { DefaultTheme } from 'styled-components'

export const noCelular = ({ theme }: { theme: DefaultTheme }) =>
  `@media (max-width: ${theme.quebra.computador})`

export const noComputador = ({ theme }: { theme: DefaultTheme }) =>
  `@media not all and (max-width: ${theme.quebra.computador})`
