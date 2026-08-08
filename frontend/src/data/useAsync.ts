import { useCallback, useEffect, useState } from 'react'

export type AsyncState<T> =
  { status: 'loading' } | { status: 'success'; data: T } | { status: 'error' }

export interface AsyncResult<T> {
  status: 'loading' | 'success' | 'error'
  data?: T
  /** Vuelve a Cargando y reintenta la operación (docs/design.md § 6: "Reintentar"). */
  retry: () => void
}

/**
 * Hook genérico para consumir la capa de datos (`src/data/*Api.ts`, siempre a
 * través de `apiRequest`) con los tres estados de pantalla de docs/design.md
 * § 6. Ningún componente de pantalla hace `fetch`/llama la API directo: todos
 * pasan por un hook construido sobre este (`useFixturesByDate`, etc.).
 */
export function useAsync<T>(factory: () => Promise<T>, deps: unknown[]): AsyncResult<T> {
  const [retryToken, setRetryToken] = useState(0)
  const requestKey = JSON.stringify([...deps, retryToken])

  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  // Reset a "loading" durante el render cuando cambia la request (patrón
  // recomendado por React para "ajustar estado cuando cambia una prop", en vez
  // de un setState síncrono al inicio del efecto: https://react.dev/learn/you-might-not-need-an-effect).
  const [trackedRequestKey, setTrackedRequestKey] = useState(requestKey)
  if (requestKey !== trackedRequestKey) {
    setTrackedRequestKey(requestKey)
    setState({ status: 'loading' })
  }

  useEffect(() => {
    let cancelled = false
    factory()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `requestKey` ya resume `deps` + `retryToken`.
  }, [requestKey])

  const retry = useCallback(() => setRetryToken((token) => token + 1), [])

  return { ...state, retry }
}
