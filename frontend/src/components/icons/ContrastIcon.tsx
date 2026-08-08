import type { IconProps } from './types'

/**
 * Círculo con la mitad izquierda rellena — opción "Automático" del control de
 * tema (§ 6.1): "las dos cosas según corresponda".
 */
export function ContrastIcon(props: IconProps) {
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
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
