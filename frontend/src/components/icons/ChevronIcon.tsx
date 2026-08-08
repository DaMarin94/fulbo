import type { IconProps } from './types'

/**
 * Chevron — patrón de botón de icono (§ 6.3): flechas de día y "volver atrás".
 * `direction` decide hacia dónde apunta; default "left" (volver atrás).
 */
export function ChevronIcon({
  direction = 'left',
  ...props
}: IconProps & { direction?: 'left' | 'right' }) {
  const d = direction === 'left' ? 'M15 5.25 8.25 12 15 18.75' : 'M9 5.25 15.75 12 9 18.75'
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={d} />
    </svg>
  )
}
