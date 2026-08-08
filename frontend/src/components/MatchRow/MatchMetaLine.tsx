import { Link } from 'react-router-dom'
import type { Competition } from '../../types/fixture'

interface MatchMetaLineProps {
  /** Fecha ya formateada — "dom 19/04" (§ 10.3). No es link. */
  dateLabel: string
  competition: Competition
  /** Compacta: alineada a la izquierda. Amplia: centrada sobre el eje (§ 8.4). */
  align?: 'start' | 'center'
}

/**
 * Meta-línea de la fila de partido — solo Equipo (§ 10.3): fecha + competición.
 * Una sola línea, nunca envuelve (si envolviera, el marcador se desalinea de
 * su equipo en compacta, § 7.0).
 */
export function MatchMetaLine({ dateLabel, competition, align = 'start' }: MatchMetaLineProps) {
  return (
    <div
      className={`tnum flex min-w-0 items-center gap-2 overflow-hidden text-xs whitespace-nowrap ${
        align === 'center' ? 'justify-center' : 'justify-start'
      }`}
    >
      <span className="font-medium text-text-2">{dateLabel}</span>
      <span aria-hidden="true" className="text-text-3">
        ·
      </span>
      <Link
        to={`/competicion/${competition.id}`}
        className="link-underline truncate font-semibold tracking-[0.04em] text-text-2 uppercase"
      >
        {competition.shortName}
      </Link>
    </div>
  )
}
