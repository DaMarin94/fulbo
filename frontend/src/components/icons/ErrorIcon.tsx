import type { IconProps } from './types'

/**
 * Icono del estado Error (docs/design.md § 6: "icono y texto en --color-danger").
 * Nota: § 5 no lo lista explícitamente en el inventario cerrado (solo nombra el
 * icono neutro de Vacío) pero § 6 sí lo pide para la tarjeta de error — gap
 * señalado en el reporte de esta etapa para que `design` lo reconcilie.
 */
export function ErrorIcon(props: IconProps) {
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
      <path d="M12 8v5" />
      <circle
        cx="12"
        cy="15.75"
        r="0.1"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  )
}
