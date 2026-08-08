import type { StatusBadgeInfo } from './matchRowPresentation'

/**
 * Franja de estado (docs/design.md § 7.2): círculo para en vivo/entretiempo
 * (verde), diamante para postergado/suspendido/cancelado (ámbar). "Nada se
 * comunica solo por color": la forma y la palabra viajan siempre juntas.
 */
export function StatusBadge({ shape, label, colorClassName, pulse }: StatusBadgeInfo) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold tracking-[0.04em] uppercase ${colorClassName}`}
    >
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
