import { describe, expect, it, vi } from 'vitest'
import { apiRequest } from './apiRequest'
import { subscribeToasts } from '../lib/toast/toastBus'

describe('apiRequest', () => {
  it('devuelve el resultado de la operación cuando no hay error', async () => {
    await expect(apiRequest(() => Promise.resolve(42))).resolves.toBe(42)
  })

  it('emite un toast de error y re-lanza el error cuando la operación falla', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)

    await expect(apiRequest(() => Promise.reject(new Error('boom')))).rejects.toThrow('boom')

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ tone: 'error', message: expect.any(String) }),
    )
    unsubscribe()
  })

  it('usa el mensaje de error custom cuando se provee', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)

    await expect(
      apiRequest(() => Promise.reject(new Error('boom')), { errorMessage: 'Mensaje custom' }),
    ).rejects.toThrow()

    expect(listener).toHaveBeenCalledWith(expect.objectContaining({ message: 'Mensaje custom' }))
    unsubscribe()
  })

  it('con silent:true no emite ningún toast, pero igual propaga el error', async () => {
    const listener = vi.fn()
    const unsubscribe = subscribeToasts(listener)

    await expect(
      apiRequest(() => Promise.reject(new Error('boom')), { silent: true }),
    ).rejects.toThrow('boom')

    expect(listener).not.toHaveBeenCalled()
    unsubscribe()
  })
})
