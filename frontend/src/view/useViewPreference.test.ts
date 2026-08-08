import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useViewPreference } from './useViewPreference'
import { VIEW_STORAGE_KEY } from './viewPreference'

afterEach(() => {
  window.localStorage.clear()
  vi.restoreAllMocks()
})

describe('useViewPreference', () => {
  it('arranca en "byCompetition" (por torneo, default de RF-008) sin nada guardado', () => {
    const { result } = renderHook(() => useViewPreference())
    expect(result.current.view).toBe('byCompetition')
  })

  it('lee la preferencia guardada en localStorage al montar', () => {
    window.localStorage.setItem(VIEW_STORAGE_KEY, 'byTime')
    const { result } = renderHook(() => useViewPreference())
    expect(result.current.view).toBe('byTime')
  })

  it('ignora un valor guardado inválido y usa el default', () => {
    window.localStorage.setItem(VIEW_STORAGE_KEY, 'algo-invalido')
    const { result } = renderHook(() => useViewPreference())
    expect(result.current.view).toBe('byCompetition')
  })

  it('alterna entre las dos vistas y persiste cada cambio', () => {
    const { result } = renderHook(() => useViewPreference())

    act(() => result.current.toggleView())
    expect(result.current.view).toBe('byTime')
    expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBe('byTime')

    act(() => result.current.toggleView())
    expect(result.current.view).toBe('byCompetition')
    expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBe('byCompetition')
  })

  it('si localStorage no está disponible, usa el default en memoria sin romper', () => {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
      throw new Error('localStorage bloqueado')
    })
    const { result } = renderHook(() => useViewPreference())
    expect(result.current.view).toBe('byCompetition')
  })

  it('si no se puede persistir, la elección igual se aplica en la sesión actual', () => {
    vi.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation(() => {
      throw new Error('localStorage lleno')
    })
    const { result } = renderHook(() => useViewPreference())

    act(() => result.current.toggleView())
    expect(result.current.view).toBe('byTime')
  })
})
