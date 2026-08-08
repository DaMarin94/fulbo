import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { groupFixturesByCompetition } from './groupByCompetition'
import { DayNavigator } from '../components/DayNavigator'
import { MatchRow } from '../components/MatchRow'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { FixturesSkeleton } from '../components/states/FixturesSkeleton'
import { sortFixturesChronologically } from '../data/proximosCut'
import { useFavoriteTeamId, useFixturesByDate } from '../data/useFixtures'
import { addDays, startOfLocalDay, toLocalDateKey } from '../lib/dateFormat'
import type { CompetitionGroup } from './groupByCompetition'

function CompetitionGroupCard({ group }: { group: CompetitionGroup }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface">
      <Link
        to={`/competicion/${group.competition.id}`}
        className="link-underline flex min-h-11 items-center border-b border-border bg-surface-2 px-3 text-xs font-semibold tracking-[0.04em] text-text-2 uppercase"
      >
        {group.competition.shortName}
      </Link>
      <div>
        {group.fixtures.map((fixture) => (
          <MatchRow key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </div>
  )
}

interface HomeScreenProps {
  /** Fecha inicial — seam de testing; en producción siempre es "hoy". */
  initialDate?: Date
}

/**
 * Inicio (RF-001, RF-002, docs/design.md § 10.1). Partidos del día elegido,
 * agrupados por competición. Dos barras de encabezado: marca+accesos (se va
 * con el scroll) y navegador de día (sticky).
 */
export function HomeScreen({ initialDate = new Date() }: HomeScreenProps = {}) {
  const [selectedDate, setSelectedDate] = useState(() => startOfLocalDay(initialDate))
  const dateKey = toLocalDateKey(selectedDate)
  const { status, data, retry } = useFixturesByDate(dateKey)
  const favoriteTeam = useFavoriteTeamId()

  const groups = useMemo(() => {
    if (!data) return []
    return groupFixturesByCompetition(sortFixturesChronologically(data))
  }, [data])

  return (
    <div>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-[720px] items-center gap-4 px-4">
          <h1
            aria-label="Fulbo"
            className="text-xl font-bold tracking-[-0.035em] text-text-1 select-none"
          >
            fulbo
            <span aria-hidden="true" className="text-brand">
              .
            </span>
          </h1>
          {favoriteTeam.status === 'success' && favoriteTeam.data ? (
            <Link
              to={`/equipo/${favoriteTeam.data}`}
              className="link-underline flex h-11 items-center text-sm font-medium text-text-1"
            >
              Mi equipo
            </Link>
          ) : (
            <span className="flex h-11 items-center text-sm font-medium text-text-2">
              Mi equipo
            </span>
          )}
          <Link
            to="/configuracion"
            className="link-underline flex h-11 items-center text-sm font-medium text-text-1"
          >
            Ajustes
          </Link>
        </div>
      </header>

      <DayNavigator
        date={selectedDate}
        onPrevDay={() => setSelectedDate((current) => addDays(current, -1))}
        onNextDay={() => setSelectedDate((current) => addDays(current, 1))}
      />

      <div className="mx-auto max-w-[720px] px-4 pt-3 pb-6 wide:px-6">
        {status === 'loading' && (
          <div className="overflow-hidden rounded-md border border-border bg-surface">
            <FixturesSkeleton />
          </div>
        )}
        {status === 'error' && <ErrorState onRetry={retry} />}
        {status === 'success' && data && data.length === 0 && (
          <EmptyState message="No hay partidos este día" />
        )}
        {status === 'success' && data && data.length > 0 && (
          <div className="flex flex-col gap-3">
            {groups.map((group) => (
              <CompetitionGroupCard key={group.competition.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
