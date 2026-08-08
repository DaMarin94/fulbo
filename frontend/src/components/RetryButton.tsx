/**
 * Patrón: botón neutro "Reintentar" (docs/design.md § 6.4). Único botón de
 * acción de la v1 fuera del control de tema; no lleva la marca.
 */
export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-11 rounded-sm border border-border bg-surface px-4 text-sm font-medium text-text-1 hover:bg-surface-2 active:bg-surface-2 active:text-brand-strong"
    >
      Reintentar
    </button>
  )
}
