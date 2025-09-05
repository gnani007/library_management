import { useState } from 'react'

export const useApiError = () => {
  const [error, setError] = useState<string | null>(null)
  const handle = (err: any) => {
    if (!err) return
    if (typeof err === 'string') setError(err)
    else if (err.message) setError(err.message)
    else setError('Unknown error')
  }
  const clear = () => setError(null)
  return { error, setError: handle, clear }
}
