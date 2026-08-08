import type { IconProps } from './types'

/**
 * Marca de competición — Primera A: círculo con estrella inscripta
 * (docs/design.md § 5, § 7.3). 18px, `currentColor`. Glifo provisional del
 * sistema de diseño, no un asset de marca aprobado (§ 7.3, § 11).
 */
export function PrimeraAMarkIcon(props: IconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.3l1.28 3.66h3.87l-3.13 2.27 1.2 3.68-3.22-2.33-3.22 2.33 1.2-3.68-3.13-2.27h3.87z" />
    </svg>
  )
}
