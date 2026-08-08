import type { IconProps } from './types'

/**
 * Intercambio — dos flechas opuestas (docs/design.md § 5, § 6.5): conmutador
 * de vista de Inicio (RF-008). 14px, excepción declarada al tamaño de icono
 * (vive dentro de una píldora de 32px, junto a una palabra de 12px).
 */
export function SwapIcon(props: IconProps) {
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
      <path d="M4 8h14M13.5 3.5 18 8l-4.5 4.5" />
      <path d="M20 16H6M10.5 11.5 6 16l4.5 4.5" />
    </svg>
  )
}
