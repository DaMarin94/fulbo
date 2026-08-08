import { useState } from 'react'
import { Link } from 'react-router-dom'
import { groupFixturesByCompetition } from './groupByCompetition'
import { groupFixturesByTime } from './groupByTime'
import { CompetitionMarkIcon } from '../components/icons/CompetitionMarkIcon'
import { GearIcon } from '../components/icons/GearIcon'
import { DayNavigator } from '../components/DayNavigator'
import { GroupSubtitulo, GroupTitular } from '../components/GroupHeading'
import { MatchRow } from '../components/MatchRow'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { FixturesSkeleton } from '../components/states/FixturesSkeleton'
import { ViewSwitcher } from '../components/ViewSwitcher'
import { useFavoriteTeamId, useFixturesByDate } from '../data/useFixtures'
import { addDays, startOfLocalDay, toLocalDateKey } from '../lib/dateFormat'
import { TBD_LABEL } from './groupingShared'
import { useViewPreference } from '../view/useViewPreference'
import type { Fixture } from '../types/fixture'

/**
 * Contenido de Inicio en sus dos vistas conmutables (RF-008, docs/design.md
 * § 10.1): "por torneo" agrupa por competición y subagrupa por horario; "por
 * horario" invierte los ejes. Mismo esqueleto (`GroupTitular`/`GroupSubtitulo`
 * + `MatchRow`) en las dos — solo cambia qué dato manda.
 */
function FixtureGroups({ fixtures, view }: { fixtures: Fixture[]; view: 'byCompetition' | 'byTime' }) {
  if (view === 'byCompetition') {
    const groups = groupFixturesByCompetition(fixtures)
    return (
      <>
        {groups.map((group, groupIndex) => (
          <div key={group.competition.id} data-testid="home-group">
            <GroupTitular
              label={group.competition.shortName}
              icon={<CompetitionMarkIcon competitionId={group.competition.id} className="h-[18px] w-[18px]" />}
              linkTo={`/competicion/${group.competition.id}`}
              isFirst={groupIndex === 0}
            />
            {group.subgroups.map((subgroup, subgroupIndex) => (
              <div key={subgroup.timeLabel}>
                <GroupSubtitulo
                  label={subgroup.timeLabel}
                  tabular={subgroup.timeLabel !== TBD_LABEL}
                  isFirst={subgroupIndex === 0}
                />
                {subgroup.fixtures.map((fixture) => (
                  <MatchRow key={fixture.id} fixture={fixture} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </>
    )
  }

  const groups = groupFixturesByTime(fixtures)
  return (
    <>
      {groups.map((group, groupIndex) => (
        <div key={group.timeLabel} data-testid="home-group">
          <GroupTitular
            label={group.timeLabel}
            tabular={group.timeLabel !== TBD_LABEL}
            isFirst={groupIndex === 0}
          />
          {group.subgroups.map((subgroup, subgroupIndex) => (
            <div key={subgroup.competition.id}>
              <GroupSubtitulo
                label={subgroup.competition.shortName}
                icon={
                  <CompetitionMarkIcon competitionId={subgroup.competition.id} className="h-[18px] w-[18px]" />
                }
                linkTo={`/competicion/${subgroup.competition.id}`}
                isFirst={subgroupIndex === 0}
              />
              {subgroup.fixtures.map((fixture) => (
                <MatchRow key={fixture.id} fixture={fixture} />
              ))}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

interface HomeScreenProps {
  /** Fecha inicial — seam de testing; en producción siempre es "hoy". */
  initialDate?: Date
}

/**
 * Inicio (RF-001, RF-002, RF-008, docs/design.md § 10.1). Partidos del día
 * elegido, en la vista conmutable elegida por el usuario (persiste en
 * `localStorage`, § 6.5). Dos barras de encabezado: marca+accesos (se va con
 * el scroll) y navegador de día (sticky).
 */
export function HomeScreen({ initialDate = new Date() }: HomeScreenProps = {}) {
  const [selectedDate, setSelectedDate] = useState(() => startOfLocalDay(initialDate))
  const dateKey = toLocalDateKey(selectedDate)
  const { status, data, retry } = useFixturesByDate(dateKey)
  const favoriteTeam = useFavoriteTeamId()
  const { view, toggleView } = useViewPreference()

  return (
    <div>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-[720px] items-center gap-3 px-3">
          <h1
            aria-label="Fulbo"
            className="flex-1 text-xl font-bold tracking-[-0.035em] text-text-1 select-none"
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
          <ViewSwitcher view={view} onToggle={toggleView} />
          <Link
            to="/configuracion"
            aria-label="Ajustes"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-1 hover:bg-surface-2 active:bg-surface-2 active:text-brand-strong"
          >
            <GearIcon className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <DayNavigator
        date={selectedDate}
        onPrevDay={() => setSelectedDate((current) => addDays(current, -1))}
        onNextDay={() => setSelectedDate((current) => addDays(current, 1))}
      />

      <div className="mx-auto max-w-[720px] px-4 pt-3 pb-6 wide:px-6">
        {status === 'loading' && <FixturesSkeleton view={view} />}
        {status === 'error' && <ErrorState onRetry={retry} />}
        {status === 'success' && data && data.length === 0 && (
          <EmptyState message="No hay partidos este día" />
        )}
        {status === 'success' && data && data.length > 0 && (
          <FixtureGroups fixtures={data} view={view} />
        )}
      </div>
    </div>
  )
}
