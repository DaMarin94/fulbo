import type { IconProps } from './types'

/**
 * Icono neutro del estado Vacío (docs/design.md § 5 y § 6): un calendario sin
 * partidos. Parte del inventario cerrado de iconos de la v1.
 */
export function EmptyIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
    </svg>
  )
}
