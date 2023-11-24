import type { Status } from './useAsyncState'
import { useAsyncState } from './useAsyncState'

type Prettify<T> = {
  [K in keyof T]: T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

export { useAsyncState }
export type { Prettify, Status }
