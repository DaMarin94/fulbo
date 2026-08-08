import { describe, expect, it } from 'vitest'
import { buildTeamListItems } from './teamListItems'
import { PRIMERA_A } from '../data/mockFixtures'
import type { Fixture } from '../types/fixture'

const TEAM_A = { id: 'a', name: 'A' }
const TEAM_B = { id: 'b', name: 'B' }
const NOW = new Date(2026, 3, 18, 12, 0)

function fixture(overrides: Partial<Fixture>): Fixture {
  return {
    id: 'f',
    competition: PRIMERA_A,
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

describe('buildTeamListItems', () => {
  it('produce una fila por partido, sin encabezados de grupo', () => {
    const items = buildTeamListItems(
      [
        fixture({
          id: '1',
          kickoff: '2026-04-16T15:00:00Z',
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
        }),
        fixture({ id: '2', kickoff: '2026-04-20T15:00:00Z' }),
      ],
      NOW,
    )
    expect(items.filter((item) => item.type === 'fixture')).toHaveLength(2)
    expect(items.every((item) => item.type === 'fixture' || item.type === 'proximos-banner')).toBe(
      true,
    )
  })

  it('cada fila trae el fixture completo, sin formatear nada de presentación', () => {
    const items = buildTeamListItems([fixture({ id: '1', kickoff: '2026-04-19T15:00:00Z' })], NOW)
    const row = items.find((item) => item.type === 'fixture')
    expect(row).toMatchObject({ type: 'fixture', fixture: { id: '1' } })
  })

  it('inserta el corte PRÓXIMOS en la posición cronológica correcta', () => {
    const items = buildTeamListItems(
      [
        fixture({
          id: 'past',
          kickoff: '2026-04-16T15:00:00Z',
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
        }),
        fixture({ id: 'next', kickoff: '2026-04-20T15:00:00Z' }),
      ],
      NOW,
    )
    expect(items.map((item) => item.type)).toEqual(['fixture', 'proximos-banner', 'fixture'])
  })

  it('lista vacía da lista de items vacía', () => {
    expect(buildTeamListItems([], NOW)).toEqual([])
  })
})
