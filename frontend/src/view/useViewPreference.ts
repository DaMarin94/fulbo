import { useState } from 'react'
import { DEFAULT_VIEW, isViewPreference, VIEW_STORAGE_KEY, type ViewPreference } from './viewPreference'

function readStoredView(): ViewPreference {
  try {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY)
    if (isViewPreference(stored)) return stored
  } catch {
    // localStorage puede no estar disponible (modo privado, storage lleno, etc.):
    // se cae al default sin persistir y sin avisarle al usuario (RF-008).
  }
  return DEFAULT_VIEW
}

function persistView(view: ViewPreference) {
  try {
    window.localStorage.setItem(VIEW_STORAGE_KEY, view)
  } catch {
    // Si no se puede persistir, la preferencia igual se aplica en esta sesión.
  }
}

/**
 * Hook de la preferencia de vista de Inicio (RF-008, docs/design.md § 6.5).
 * Enteramente client-side, persistida en `localStorage`
 * (docs/frontend.md § Estado del cliente) — no hay cookies ni endpoint en el
 * backend. Si el storage no está disponible, usa el default en memoria y no
 * persiste, sin mostrar ningún error.
 */
export function useViewPreference() {
  const [view, setView] = useState<ViewPreference>(readStoredView)

  function toggleView() {
    setView((current) => {
      const next: ViewPreference = current === 'byCompetition' ? 'byTime' : 'byCompetition'
      persistView(next)
      return next
    })
  }

  return { view, toggleView }
}
