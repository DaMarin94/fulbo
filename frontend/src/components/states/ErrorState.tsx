import { ErrorIcon } from '../icons/ErrorIcon'
import { RetryButton } from '../RetryButton'

/**
 * Estado Error (docs/design.md § 6): tarjeta con borde `--color-danger`, icono
 * y texto en `--color-danger`, botón Reintentar debajo. Reemplaza la lista
 * entera. Copy propuesto por `design`, pendiente de OK de producto — no lo
 * inventé, está literal en design.md § 6.
 */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-4 my-6 flex flex-col items-center gap-3 rounded-md border border-danger bg-surface px-4 py-6 text-center">
      <ErrorIcon className="h-6 w-6 text-danger" />
      <p className="text-base font-semibold text-danger">No pudimos cargar los partidos</p>
      <p className="text-sm text-danger">Revisá tu conexión y volvé a intentar.</p>
      <RetryButton onClick={onRetry} />
    </div>
  )
}
