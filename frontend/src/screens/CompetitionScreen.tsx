import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { buildCompetitionListItems } from './competitionListItems'
import { DrillDownHeader } from '../components/DrillDownHeader'
import { MatchRow } from '../components/MatchRow'
import { ProximosBanner } from '../components/ProximosBanner'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { FixturesSkeleton } from '../components/states/FixturesSkeleton'
import { useCompetitionById, useFixturesByCompetition } from '../data/useFixtures'

function DayHeader({ label }: { label: string }) {
  return (
    <div className="flex min-h-11 items-center border-b border-border bg-surface-2 px-3">
      <span className="tnum text-xs font-semibold tracking-[0.04em] text-text-2 uppercase">
        {label}
      </span>
    </div>
  )
}

interface CompetitionScreenProps {
  /** Referencia de "ahora" para el corte PRÓXIMOS — seam de testing. */
  now?: Date
}

/**
 * Competición (RF-003, docs/design.md § 10.2). Partidos de una competición,
 * agrupados por fecha, abriendo posicionados en el corte `PRÓXIMOS` (§ 7.6).
 */
export function CompetitionScreen({ now = new Date() }: CompetitionScreenProps = {}) {
  const { competitionId = '' } = useParams()
  const competitionQuery = useCompetitionById(competitionId)
  const fixturesQuery = useFixturesByCompetition(competitionId)
  const bannerRef = useRef<HTMLDivElement>(null)

  const items = useMemo(
    () => (fixturesQuery.data ? buildCompetitionListItems(fixturesQuery.data, now) : []),
    [fixturesQuery.data, now],
  )

  useEffect(() => {
    if (fixturesQuery.status === 'success' && bannerRef.current) {
      bannerRef.current.scrollIntoView({ block: 'start' })
    }
  }, [fixturesQuery.status])

  return (
    <div>
      <DrillDownHeader title={competitionQuery.data?.name ?? ''} backTo="/" />
      <div className="mx-auto max-w-[720px] px-4 pb-6 wide:px-6">
        {fixturesQuery.status === 'loading' && <FixturesSkeleton />}
        {fixturesQuery.status === 'error' && <ErrorState onRetry={fixturesQuery.retry} />}
        {fixturesQuery.status === 'success' && fixturesQuery.data?.length === 0 && (
          <EmptyState message="No hay partidos para esta competición" />
        )}
        {fixturesQuery.status === 'success' &&
          fixturesQuery.data &&
          fixturesQuery.data.length > 0 && (
            <div>
              {items.map((item) => {
                if (item.type === 'day-header')
                  return <DayHeader key={item.key} label={item.label} />
                if (item.type === 'proximos-banner')
                  return (
                    <div key={item.key} ref={bannerRef} className="scroll-mt-14">
                      <ProximosBanner />
                    </div>
                  )
                return <MatchRow key={item.key} fixture={item.fixture} />
              })}
            </div>
          )}
      </div>
    </div>
  )
}
