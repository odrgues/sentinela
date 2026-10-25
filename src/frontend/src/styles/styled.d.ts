import 'styled-components'
import type { Tema } from './tema'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- é assim que o styled-components recebe o tipo do tema
  export interface DefaultTheme extends Tema {}
}
