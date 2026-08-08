import type { IconProps } from './types'

/**
 * Marca de competición — Copa Sudamericana: rombo con rombo interior
 * (docs/design.md § 5, § 7.3). 18px, `currentColor`. Glifo provisional del
 * sistema de diseño, no un asset de marca aprobado (§ 7.3, § 11).
 */
export function SudamericanaMarkIcon(props: IconProps) {
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
      <path d="M12 3.25 20.75 12 12 20.75 3.25 12z" />
      <path d="M12 8.25 15.75 12 12 15.75 8.25 12z" fill="currentColor" stroke="none" />
    </svg>
  )
}
