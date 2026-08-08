import { describe, expect, it } from 'vitest'
import { groupFixturesByCompetition } from './groupByCompetition'
import type { Fixture } from '../types/fixture'
import { LIBERTADORES, PRIMERA_A, SUDAMERICANA } from '../data/mockFixtures'

const TEAM_A = { id: 'a', name: 'A' }
const TEAM_B = { id: 'b', name: 'B' }

function fixture(id: string, competition: typeof PRIMERA_A): Fixture {
  return {
    id,
    competition,
    homeTeam: TEAM_A,
    awayTeam: TEAM_B,
    kickoff: '2026-04-18T15:00:00Z',
    status: 'scheduled',
    minute: null,
    homeScore: null,
    awayScore: null,
  }
}

describe('groupFixturesByCompetition', () => {
  it('agrupa los partidos por competición', () => {
    const groups = groupFixturesByCompetition([
      fixture('1', PRIMERA_A),
      fixture('2', LIBERTADORES),
      fixture('3', PRIMERA_A),
    ])
    expect(groups).toHaveLength(2)
    expect(groups[0].competition.id).toBe('primera-a')
    expect(groups[0].fixtures.map((f) => f.id)).toEqual(['1', '3'])
    expect(groups[1].competition.id).toBe('libertadores')
    expect(groups[1].fixtures.map((f) => f.id)).toEqual(['2'])
  })

  it('respeta el orden de primera aparición', () => {
    const groups = groupFixturesByCompetition([
      fixture('1', SUDAMERICANA),
      fixture('2', PRIMERA_A),
      fixture('3', LIBERTADORES),
    ])
    expect(groups.map((g) => g.competition.id)).toEqual([
      'sudamericana',
      'primera-a',
      'libertadores',
    ])
  })

  it('array vacío da lista de grupos vacía', () => {
    expect(groupFixturesByCompetition([])).toEqual([])
  })

  it('máximo 3 grupos en la v1: nunca más grupos que competiciones distintas', () => {
    const groups = groupFixturesByCompetition([
      fixture('1', PRIMERA_A),
      fixture('2', LIBERTADORES),
      fixture('3', SUDAMERICANA),
      fixture('4', PRIMERA_A),
    ])
    expect(groups.length).toBeLessThanOrEqual(3)
  })
})
