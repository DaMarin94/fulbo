export interface ToastMessage {
  id: string
  tone: 'error'
  message: string
}

type Listener = (toast: ToastMessage) => void

/**
 * Bus mínimo de pub/sub, desacoplado de React. Existe para que la capa central
 * de HTTP (`src/data/apiRequest.ts`) pueda emitir un toast desde una función
 * async cualquiera, sin depender de estar dentro de un componente ni de un
 * hook — `ToastProvider` es el único suscriptor real, montado una vez en la
 * raíz de la app (`src/main.tsx`).
 */
const listeners = new Set<Listener>()

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function emitToast(toast: Omit<ToastMessage, 'id'>): void {
  const withId: ToastMessage = { ...toast, id: crypto.randomUUID() }
  listeners.forEach((listener) => listener(withId))
}
