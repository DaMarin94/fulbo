import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  isThemePreference,
  resolveThemeMode,
  THEME_STORAGE_KEY,
  type ThemeMode,
  type ThemePreference,
} from './theme'

function readStoredPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (isThemePreference(stored)) return stored
  } catch {
    // localStorage puede no estar disponible (modo privado, storage lleno, etc.):
    // se cae al default de fábrica sin romper la carga de la app.
  }
  return 'auto'
}

function getSystemPrefersDark(): boolean {
  if (typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function applyResolvedMode(mode: ThemeMode) {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}

interface ThemeContextValue {
  preference: ThemePreference
  resolvedMode: ThemeMode
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference)
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(getSystemPrefersDark)

  const resolvedMode = useMemo(
    () => resolveThemeMode(preference, systemPrefersDark),
    [preference, systemPrefersDark],
  )

  // § 3.6 — con "auto" elegido, la app sigue al sistema EN VIVO, sin recargar.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  // Aplica el modo resuelto al <html> en cada cambio. La carga inicial ya la
  // resuelve el script inline de index.html (sin flash); esto mantiene el
  // documento en sincro ante cambios de preferencia o del sistema en vivo.
  useEffect(() => {
    applyResolvedMode(resolvedMode)
  }, [resolvedMode])

  const setPreference = (next: ThemePreference) => {
    setPreferenceState(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Si no se puede persistir, la preferencia igual se aplica en esta sesión.
    }
  }

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolvedMode, setPreference }),
    [preference, resolvedMode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
