import { describe, expect, it } from 'vitest'
import { isThemePreference, resolveThemeMode, THEME_STORAGE_KEY } from './theme'

describe('theme.ts', () => {
  it('expone la clave de storage esperada', () => {
    expect(THEME_STORAGE_KEY).toBe('fulbo:theme-preference')
  })

  describe('isThemePreference', () => {
    it('acepta los tres valores válidos', () => {
      expect(isThemePreference('light')).toBe(true)
      expect(isThemePreference('dark')).toBe(true)
      expect(isThemePreference('auto')).toBe(true)
    })

    it('rechaza cualquier otro valor', () => {
      expect(isThemePreference('sepia')).toBe(false)
      expect(isThemePreference(null)).toBe(false)
      expect(isThemePreference(undefined)).toBe(false)
      expect(isThemePreference('')).toBe(false)
    })
  })

  describe('resolveThemeMode', () => {
    it('"light" siempre resuelve a claro, sin importar el sistema', () => {
      expect(resolveThemeMode('light', true)).toBe('light')
      expect(resolveThemeMode('light', false)).toBe('light')
    })

    it('"dark" siempre resuelve a oscuro, sin importar el sistema', () => {
      expect(resolveThemeMode('dark', true)).toBe('dark')
      expect(resolveThemeMode('dark', false)).toBe('dark')
    })

    it('"auto" sigue al sistema', () => {
      expect(resolveThemeMode('auto', true)).toBe('dark')
      expect(resolveThemeMode('auto', false)).toBe('light')
    })
  })
})
