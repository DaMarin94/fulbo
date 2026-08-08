import type { IconProps } from './types'

/**
 * Marca de competición — Copa Libertadores: escudo con disco central
 * (docs/design.md § 5, § 7.3). 18px, `currentColor`. Glifo provisional del
 * sistema de diseño, no un asset de marca aprobado (§ 7.3, § 11).
 */
export function LibertadoresMarkIcon(props: IconProps) {
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
      <path d="M12 3.25 18.5 5.5v5.3c0 4.65-2.9 8-6.5 9.6-3.6-1.6-6.5-4.95-6.5-9.6V5.5z" />
      <circle cx="12" cy="11" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
