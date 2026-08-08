import { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { buildTeamListItems } from './teamListItems'
import { DrillDownHeader } from '../components/DrillDownHeader'
import { MatchRow } from '../components/MatchRow'
import { ProximosBanner } from '../components/ProximosBanner'
import { EmptyState } from '../components/states/EmptyState'
import { ErrorState } from '../components/states/ErrorState'
import { FixturesSkeleton } from '../components/states/FixturesSkeleton'
import { useFixturesByTeam, useTeamById } from '../data/useFixtures'

interface TeamScreenProps {
  /** Referencia de "ahora" para el corte PRÓXIMOS — seam de testing. */
  now?: Date
}

/**
 * Equipo (RF-004, RF-005, docs/design.md § 10.3). Fixture propio de un
 * equipo (incluido el favorito), lista plana cronológica ascendente, con
 * meta-línea (fecha + hora + competición) por fila y el corte `PRÓXIMOS`
 * (§ 7.6).
 */
export function TeamScreen({ now = new Date() }: TeamScreenProps = {}) {
  const { teamId = '' } = useParams()
  const teamQuery = useTeamById(teamId)
  const fixturesQuery = useFixturesByTeam(teamId)
  const bannerRef = useRef<HTMLDivElement>(null)

  const items = useMemo(
    () => (fixturesQuery.data ? buildTeamListItems(fixturesQuery.data, now) : []),
    [fixturesQuery.data, now],
  )

  useEffect(() => {
    if (fixturesQuery.status === 'success' && bannerRef.current) {
      bannerRef.current.scrollIntoView({ block: 'start' })
    }
  }, [fixturesQuery.status])

  return (
    <div>
      <DrillDownHeader title={teamQuery.data?.name ?? ''} backTo="/" />
      <div className="mx-auto max-w-[720px] px-4 pb-6 wide:px-6">
        {fixturesQuery.status === 'loading' && <FixturesSkeleton />}
        {fixturesQuery.status === 'error' && <ErrorState onRetry={fixturesQuery.retry} />}
        {fixturesQuery.status === 'success' && fixturesQuery.data?.length === 0 && (
          <EmptyState message="No hay partidos para este equipo" />
        )}
        {fixturesQuery.status === 'success' &&
          fixturesQuery.data &&
          fixturesQuery.data.length > 0 && (
            <div>
              {items.map((item) => {
                if (item.type === 'proximos-banner')
                  return (
                    <div key={item.key} ref={bannerRef} className="scroll-mt-14">
                      <ProximosBanner />
                    </div>
                  )
                return <MatchRow key={item.key} fixture={item.fixture} showMetaLine />
              })}
            </div>
          )}
      </div>
    </div>
  )
}
