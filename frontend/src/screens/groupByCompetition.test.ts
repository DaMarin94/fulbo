import { describe, expect, it } from 'vitest'
import { groupFixturesByCompetition } from './groupByCompetition'
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

function allFixtures(groups: ReturnType<typeof groupFixturesByCompetition>) {
  return groups.flatMap((group) => group.subgroups.flatMap((subgroup) => subgroup.fixtures))
}

describe('groupFixturesByCompetition', () => {
  it('agrupa los partidos por competición', () => {
    const groups = groupFixturesByCompetition([
      fixture({ id: '1', competition: PRIMERA_A }),
      fixture({ id: '2', competition: LIBERTADORES }),
      fixture({ id: '3', competition: PRIMERA_A, kickoff: '2026-04-18T18:00:00Z' }),
    ])
    expect(groups).toHaveLength(2)
    expect(groups[0].competition.id).toBe('primera-a')
    expect(allFixtures([groups[0]]).map((f) => f.id)).toEqual(['1', '3'])
    expect(groups[1].competition.id).toBe('libertadores')
    expect(allFixtures([groups[1]]).map((f) => f.id)).toEqual(['2'])
  })

  it('respeta el orden de primera aparición entre competiciones', () => {
    const groups = groupFixturesByCompetition([
      fixture({ id: '1', competition: SUDAMERICANA }),
      fixture({ id: '2', competition: PRIMERA_A }),
      fixture({ id: '3', competition: LIBERTADORES }),
    ])
    expect(groups.map((g) => g.competition.id)).toEqual([
      'sudamericana',
      'primera-a',
      'libertadores',
    ])
  })

  it('dentro de cada competición, subagrupa por horario en orden cronológico', () => {
    const groups = groupFixturesByCompetition([
      fixture({ id: '1', competition: PRIMERA_A, kickoff: '2026-04-18T21:00:00Z' }),
      fixture({ id: '2', competition: PRIMERA_A, kickoff: '2026-04-18T15:00:00Z' }),
      fixture({ id: '3', competition: PRIMERA_A, kickoff: '2026-04-18T15:00:00Z' }),
    ])
    expect(groups).toHaveLength(1)
    expect(groups[0].subgroups.map((s) => s.fixtures.map((f) => f.id))).toEqual([
      ['2', '3'],
      ['1'],
    ])
  })

  it('el subgrupo "A confirmar" va al final dentro de su competición', () => {
    const groups = groupFixturesByCompetition([
      fixture({ id: '1', competition: PRIMERA_A, kickoff: null, status: 'tbd' }),
      fixture({ id: '2', competition: PRIMERA_A, kickoff: '2026-04-18T15:00:00Z' }),
    ])
    expect(groups[0].subgroups.map((s) => s.timeLabel)).toEqual([
      groups[0].subgroups[0].timeLabel,
      'A confirmar',
    ])
  })

  it('array vacío da lista de grupos vacía', () => {
    expect(groupFixturesByCompetition([])).toEqual([])
  })

  it('máximo 3 grupos en la v1: nunca más grupos que competiciones distintas', () => {
    const groups = groupFixturesByCompetition([
      fixture({ id: '1', competition: PRIMERA_A }),
      fixture({ id: '2', competition: LIBERTADORES }),
      fixture({ id: '3', competition: SUDAMERICANA }),
      fixture({ id: '4', competition: PRIMERA_A }),
    ])
    expect(groups.length).toBeLessThanOrEqual(3)
  })
})
