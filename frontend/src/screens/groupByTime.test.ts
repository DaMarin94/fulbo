import { describe, expect, it } from 'vitest'
import { groupFixturesByTime } from './groupByTime'
import type { Fixture } from '../types/fixture'
import { LIBERTADORES, PRIMERA_A, SUDAMERICANA } from '../data/mockFixtures'

const TEAM_A = { id: 'a', name: 'A' }
const TEAM_B = { id: 'b', name: 'B' }

function fixture(overrides: Partial<Fixture> & { id: string; competition: typeof PRIMERA_A }): Fixture {
  return {
    homeTeam: TEAM_A,
    awayTeam: TEAM_B,
    kickoff: '2026-04-18T15:00:00Z',
    status: 'scheduled',
    minute: null,
    homeScore: null,
    awayScore: null,
    ...overrides,
  }
}

describe('groupFixturesByTime', () => {
  it('agrupa los partidos por horario, en orden cronológico', () => {
    const groups = groupFixturesByTime([
      fixture({ id: '1', competition: PRIMERA_A, kickoff: '2026-04-18T21:00:00Z' }),
      fixture({ id: '2', competition: PRIMERA_A, kickoff: '2026-04-18T15:00:00Z' }),
      fixture({ id: '3', competition: LIBERTADORES, kickoff: '2026-04-18T15:00:00Z' }),
    ])
    expect(groups).toHaveLength(2)
    expect(groups[0].subgroups.flatMap((s) => s.fixtures.map((f) => f.id))).toEqual(['2', '3'])
    expect(groups[1].subgroups.flatMap((s) => s.fixtures.map((f) => f.id))).toEqual(['1'])
  })

  it('dentro de cada horario, subagrupa por competición en orden de primera aparición', () => {
    const groups = groupFixturesByTime([
      fixture({ id: '1', competition: SUDAMERICANA, kickoff: '2026-04-18T15:00:00Z' }),
      fixture({ id: '2', competition: PRIMERA_A, kickoff: '2026-04-18T15:00:00Z' }),
    ])
    expect(groups).toHaveLength(1)
    expect(groups[0].subgroups.map((s) => s.competition.id)).toEqual(['sudamericana', 'primera-a'])
  })

  it('el grupo "A confirmar" va al final', () => {
    const groups = groupFixturesByTime([
      fixture({ id: '1', competition: PRIMERA_A, kickoff: null, status: 'tbd' }),
      fixture({ id: '2', competition: PRIMERA_A, kickoff: '2026-04-18T21:00:00Z' }),
      fixture({ id: '3', competition: PRIMERA_A, kickoff: '2026-04-18T15:00:00Z' }),
    ])
    expect(groups.map((g) => g.timeLabel)).toEqual([
      groups[0].timeLabel,
      groups[1].timeLabel,
      'A confirmar',
    ])
    expect(groups[2].timeLabel).toBe('A confirmar')
  })

  it('array vacío da lista de grupos vacía', () => {
    expect(groupFixturesByTime([])).toEqual([])
  })
})
