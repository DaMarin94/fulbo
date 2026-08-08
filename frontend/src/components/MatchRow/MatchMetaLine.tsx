import { Link } from 'react-router-dom'
import { CompetitionMarkIcon } from '../icons/CompetitionMarkIcon'
import { formatKickoffTime, formatShortNumericDate } from '../../lib/dateFormat'
import type { Fixture } from '../../types/fixture'

interface MatchMetaLineProps {
  fixture: Fixture
  /** Compacta: alineada a la izquierda. Amplia: centrada sobre el eje (§ 8.4). */
  align?: 'start' | 'center'
}

/**
 * Meta-línea de la fila de partido — solo Equipo (§ 10.3): fecha + hora +
 * competición, en ese orden. Una sola línea, nunca envuelve; el nombre de
 * competición (el segmento más ancho y variable) es el que cede si hace falta
 * truncar — en la práctica casi nunca pasa (§ 10.3, contención).
 */
export function MatchMetaLine({ fixture, align = 'start' }: MatchMetaLineProps) {
  const dateLabel = fixture.kickoff ? formatShortNumericDate(new Date(fixture.kickoff)) : '—'
  const timeLabel = formatKickoffTime(fixture.kickoff)

  return (
    <div
      className={`flex min-h-6 min-w-0 items-center gap-2 overflow-hidden text-xs font-semibold tracking-[0.04em] text-text-3 ${
        align === 'center' ? 'justify-center' : 'justify-start'
      }`}
    >
      <span className="tnum shrink-0">{dateLabel}</span>
      <span aria-hidden="true" className="shrink-0">
        ·
      </span>
      <span className="tnum shrink-0">{timeLabel}</span>
      <span aria-hidden="true" className="shrink-0">
        ·
      </span>
      <CompetitionMarkIcon
        competitionId={fixture.competition.id}
        className="h-[18px] w-[18px] shrink-0"
      />
      <Link
        to={`/competicion/${fixture.competition.id}`}
        className="link-underline min-w-0 truncate"
      >
        {fixture.competition.shortName}
      </Link>
    </div>
  )
}
