import 'styled-components'
import type { AppTheme } from './chromeNeutral'

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}