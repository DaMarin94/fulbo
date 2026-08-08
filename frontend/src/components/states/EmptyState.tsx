import { EmptyIcon } from '../icons/EmptyIcon'

/**
 * Estado Vacío (docs/design.md § 6): bloque centrado, icono neutro 24px en
 * `--color-text-3` + una línea `--fs-base`/`--color-text-2`. Sin ilustración,
 * sin botón.
 */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
      <EmptyIcon className="h-6 w-6 text-text-3" />
      <p className="text-base text-text-2">{message}</p>
    </div>
  )
}
