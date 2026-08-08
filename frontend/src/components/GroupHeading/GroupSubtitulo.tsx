import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface GroupSubtituloProps {
  label: string
  /** Marca de competición (18px), cuando corresponde (§ 7.3). */
  icon?: ReactNode
  /** Si está presente, el texto es link (nombre de competición); fecha y hora nunca lo son (§ 3.3). */
  linkTo?: string
  /** Horarios van en números tabulares (§ 4.2). */
  tabular?: boolean
  /** El primer subgrupo de su grupo no lleva margen superior (§ 7.0). */
  isFirst: boolean
}

/**
 * Subtítulo del envoltorio de grupo (docs/design.md § 7.0): 12px/600, tracking
 * `0.04em`, `--color-text-3`, igual en compacta y amplia salvo que en amplia
 * se centra (§ 8.4). Sin línea divisoria (esa es exclusiva del titular).
 */
export function GroupSubtitulo({ label, icon, linkTo, tabular, isFirst }: GroupSubtituloProps) {
  const textClassName = `min-w-0 truncate text-xs font-semibold tracking-[0.04em] text-text-3 ${
    tabular ? 'tnum' : ''
  }`

  return (
    <div className={`flex min-h-6 items-center gap-2 ${isFirst ? '' : 'mt-2'} mb-1 wide:justify-center`}>
      {icon}
      {linkTo ? (
        <Link to={linkTo} className={`link-underline ${textClassName}`}>
          {label}
        </Link>
      ) : (
        <span className={textClassName}>{label}</span>
      )}
    </div>
  )
}
