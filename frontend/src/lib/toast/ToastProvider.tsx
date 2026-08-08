import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { subscribeToasts, type ToastMessage } from './toastBus'

const AUTO_DISMISS_MS = 6000

/**
 * Visor de toasts (docs/technical.md § Manejo de errores: "el error se le
 * muestra al usuario en toast"). Sin spec visual de `design` (no está en
 * docs/design.md — no hay ningún componente de notificación en la guía viva
 * de diseño): usa únicamente tokens ya existentes (superficie + borde +
 * texto en `--color-danger`, el mismo tratamiento que la tarjeta de Error de
 * § 6) para no inventar un lenguaje visual nuevo. Sin icono, a propósito: el
 * inventario de iconos de la v1 está cerrado (§ 5) y un toast no está en esa
 * lista — el texto solo ya comunica el error sin depender del color.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    return subscribeToasts((toast) => {
      setToasts((current) => [...current, toast])
    })
  }, [])

  function dismiss(id: string) {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map((toast) => setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS))
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [toasts])

  return (
    <>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4"
        aria-live="assertive"
        role="region"
        aria-label="Notificaciones"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className="pointer-events-auto flex w-full max-w-[360px] items-center justify-between gap-3 rounded-md border border-danger bg-surface px-4 py-3 shadow-1"
          >
            <p className="text-sm text-danger">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="link-underline shrink-0 text-sm font-medium text-text-1"
            >
              Cerrar
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
