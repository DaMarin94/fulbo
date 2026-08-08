import type { StatusBadgeInfo } from './matchRowPresentation'

/**
 * Línea de estado del bloque (docs/design.md § 7.0, § 7.2): círculo para en
 * vivo/entretiempo (verde, pulsa), rombo para postergado/suspendido/cancelado
 * (ámbar). Palabra completa, capitalizada, sin tracking (12px/500) — no es una
 * etiqueta, es una palabra que se lee. "Nada se comunica solo por color": la
 * forma y la palabra viajan siempre juntas.
 */
export function StatusBadge({ shape, label, colorClassName, pulse }: StatusBadgeInfo) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-medium ${colorClassName}`}>
      {shape === 'dot' && (
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full bg-current ${pulse ? 'animate-fulbo-pulse' : ''}`}
        />
      )}
      {shape === 'diamond' && (
        <span aria-hidden="true" className="h-2 w-2 shrink-0 rotate-45 bg-current" />
      )}
      {label}
    </span>
  )
}
