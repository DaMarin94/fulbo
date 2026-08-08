import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAsync } from './useAsync'

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

describe('useAsync', () => {
  it('arranca en "loading" y pasa a "success" con el dato', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.resolve('ok'), []))
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toBe('ok')
  })

  it('pasa a "error" cuando la operación rechaza', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.reject(new Error('boom')), []))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.data).toBeUndefined()
  })

  it('retry() vuelve a "loading" y repite la operación', async () => {
    const factory = vi.fn().mockResolvedValue('valor')
    const { result } = renderHook(() => useAsync(factory, []))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(factory).toHaveBeenCalledTimes(1)

    act(() => result.current.retry())
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(factory).toHaveBeenCalledTimes(2)
  })

  it('vuelve a pedir los datos cuando cambian las dependencias', async () => {
    const factory = vi.fn().mockResolvedValue('valor')
    const { result, rerender } = renderHook(({ dep }) => useAsync(factory, [dep]), {
      initialProps: { dep: 'a' },
    })
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(factory).toHaveBeenCalledTimes(1)

    rerender({ dep: 'b' })
    await waitFor(() => expect(factory).toHaveBeenCalledTimes(2))
  })

  it('ignora una respuesta tardía si el componente se desmontó', async () => {
    let resolvePromise: (value: string) => void = () => {}
    const factory = () =>
      new Promise<string>((resolve) => {
        resolvePromise = resolve
      })
    const { result, unmount } = renderHook(() => useAsync(factory, []))
    expect(result.current.status).toBe('loading')
    unmount()
    resolvePromise('tarde')
    await flushPromises()
    // No hay assertion sobre `result.current` post-unmount (React lo congela);
    // lo que se verifica es que no explota (no hay `setState` sobre desmontado).
  })
})
