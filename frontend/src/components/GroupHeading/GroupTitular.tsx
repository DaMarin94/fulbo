import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface GroupTitularProps {
  label: string
  /** Marca de competición (18px), cuando corresponde (§ 7.3). */
  icon?: ReactNode
  /** Si está presente, el texto es link (nombre de competición); fecha y hora nunca lo son (§ 3.3). */
  linkTo?: string
  /** Horarios y fechas van en números tabulares (§ 4.2). */
  tabular?: boolean
  /** El primer grupo de la lista no lleva margen superior (§ 7.0). */
  isFirst: boolean
}

/**
 * Titular del envoltorio de grupo (docs/design.md § 7.0): 18px/700/-0.02em en
 * compacta, 22px en amplia (§ 8.4). La línea divisoria de 2px `--color-border`
 * corre a la derecha del texto en compacta y a los dos lados en amplia — los
 * dos `<span>` de `flex-1` reparten el espacio sobrante y centran solos el
 * contenido, sin necesitar `justify-center` (el que en compacta está oculto
 * hace que el contenido arranque pegado al borde izquierdo).
 */
export function GroupTitular({ label, icon, linkTo, tabular, isFirst }: GroupTitularProps) {
  const textClassName = `min-w-0 truncate text-lg font-bold tracking-[-0.02em] text-text-1 wide:text-xl ${
    tabular ? 'tnum' : ''
  }`

  return (
    <div className={`flex min-h-8 items-center gap-2 ${isFirst ? '' : 'mt-4'} mb-2`}>
      <span aria-hidden="true" className="hidden h-0.5 flex-1 bg-border wide:block" />
      {icon}
      {linkTo ? (
        <Link to={linkTo} className={`link-underline ${textClassName}`}>
          {label}
        </Link>
      ) : (
        <span className={textClassName}>{label}</span>
      )}
      <span aria-hidden="true" className="h-0.5 flex-1 bg-border" />
    </div>
  )
}
