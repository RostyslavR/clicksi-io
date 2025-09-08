export type { Translation } from './types'
export { uk } from './uk'
export { en } from './en'
export { pl } from './pl'

import { Translation } from './types'
import { uk } from './uk'
import { en } from './en'
import { pl } from './pl'

export const translations: Record<string, Translation> = {
  uk,
  en,
  pl
}