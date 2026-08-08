import { emitToast } from '../lib/toast/toastBus'

const DEFAULT_ERROR_MESSAGE = 'No pudimos completar la operación. Intentá de nuevo.'

export interface ApiRequestOptions {
  /**
   * No dispara el toast de error (ej. una búsqueda de nombre para un título de
   * encabezado, donde una tarjeta de Error dedicada no tendría sentido). El
   * error igual se propaga: quien llama decide qué hacer con él.
   */
  silent?: boolean
  errorMessage?: string
}

/**
 * Capa central de HTTP / manejo de errores (docs/technical.md § Manejo de
 * errores). Todo acceso a datos pasa por acá — hoy contra `src/data/*Api.ts`
 * (mocks locales), mañana contra el backend real por HTTP; el cambio es
 * interno a esas funciones, esta capa no se entera. Nunca hay `fetch` suelto
 * en un componente: los componentes consumen los hooks de `src/data/hooks/*`,
 * que son los únicos que llaman `apiRequest`.
 *
 * La cuota de API-Football agotada NO es un caso especial acá (RF-006): esta
 * capa solo sabe de éxito/error de red, nunca de cuota — ese concepto ni
 * siquiera le llega, es interno al backend.
 */
export async function apiRequest<T>(
  operation: () => Promise<T>,
  { silent = false, errorMessage = DEFAULT_ERROR_MESSAGE }: ApiRequestOptions = {},
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (!silent) {
      emitToast({ tone: 'error', message: errorMessage })
    }
    throw error
  }
}
