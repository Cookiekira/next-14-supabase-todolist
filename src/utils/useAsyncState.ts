import { useState } from 'react'

export type Status = 'idle' | 'pending' | 'success' | 'error'

export function useAsyncState<Data, Params extends unknown[]>(
  promise: Promise<Data> | ((...args: Params) => Promise<Data>),
  initialState: Data
) {
  const [status, setStatus] = useState<Status>('idle')
  const [data, setData] = useState<Data>(initialState)
  const [error, setError] = useState<Error | null>(null)
  const [args, setArgs] = useState<Params | null>(null)

  const execute = async (...args: Params) => {
    setStatus('pending')
    setData(initialState)
    setError(null)
    setArgs(args)

    try {
      const data = await (typeof promise === 'function'
        ? promise(...args)
        : promise)

      setData(data)
      setStatus('success')
    } catch (error) {
      error instanceof Error && setError(error)
      setStatus('error')
    }
  }

  return { execute, status, data, error, args }
}
