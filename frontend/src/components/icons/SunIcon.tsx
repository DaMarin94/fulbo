import type { IconProps } from './types'

/** Sol: círculo + 8 rayos — opción "Claro" del control de tema (§ 6.1). */
export function SunIcon(props: IconProps) {
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
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.5v3M12 18.5v3M4.75 4.75l2.15 2.15M17.1 17.1l2.15 2.15M2.5 12h3M18.5 12h3M4.75 19.25l2.15-2.15M17.1 6.9l2.15-2.15" />
    </svg>
  )
}
