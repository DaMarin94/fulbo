import { describe, expect, it } from 'vitest'
import { buildCompetitionListItems } from './competitionListItems'
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

describe('buildCompetitionListItems', () => {
  it('inserta un encabezado de día por cada fecha distinta', () => {
    const items = buildCompetitionListItems(
      [
        fixture({
          id: '1',
          kickoff: '2026-04-16T15:00:00Z',
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
        }),
        fixture({
          id: '2',
          kickoff: '2026-04-16T18:00:00Z',
          status: 'finished',
          homeScore: 0,
          awayScore: 0,
        }),
        fixture({
          id: '3',
          kickoff: '2026-04-17T15:00:00Z',
          status: 'finished',
          homeScore: 2,
          awayScore: 1,
        }),
      ],
      NOW,
    )
    const dayHeaders = items.filter((item) => item.type === 'day-header')
    expect(dayHeaders).toHaveLength(2)
  })

  it('subagrupa por horario dentro de cada fecha: una hora distinta, un subencabezado nuevo', () => {
    const items = buildCompetitionListItems(
      [
        fixture({
          id: '1',
          kickoff: '2026-04-16T15:00:00Z',
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
        }),
        fixture({
          id: '2',
          kickoff: '2026-04-16T18:00:00Z',
          status: 'finished',
          homeScore: 0,
          awayScore: 0,
        }),
      ],
      NOW,
    )
    const subheaders = items.filter((item) => item.type === 'time-subheader')
    expect(subheaders).toHaveLength(2)
  })

  it('la misma hora dentro de una fecha no repite el subencabezado', () => {
    const items = buildCompetitionListItems(
      [
        fixture({
          id: '1',
          kickoff: '2026-04-16T15:00:00Z',
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
        }),
        fixture({
          id: '2',
          kickoff: '2026-04-16T15:00:00Z',
          status: 'finished',
          homeScore: 0,
          awayScore: 0,
        }),
      ],
      NOW,
    )
    const subheaders = items.filter((item) => item.type === 'time-subheader')
    expect(subheaders).toHaveLength(1)
  })

  it('el primer encabezado de día y el primer subencabezado de cada día llevan isFirst', () => {
    const items = buildCompetitionListItems(
      [
        fixture({
          id: '1',
          kickoff: '2026-04-16T15:00:00Z',
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
        }),
        fixture({
          id: '2',
          kickoff: '2026-04-16T18:00:00Z',
          status: 'finished',
          homeScore: 0,
          awayScore: 0,
        }),
        fixture({
          id: '3',
          kickoff: '2026-04-17T15:00:00Z',
          status: 'finished',
          homeScore: 2,
          awayScore: 1,
        }),
      ],
      NOW,
    )
    const dayHeaders = items.filter((item) => item.type === 'day-header')
    expect(dayHeaders.map((h) => h.isFirst)).toEqual([true, false])
    const subheaders = items.filter((item) => item.type === 'time-subheader')
    // Dos días, un subencabezado "primero" por día.
    expect(subheaders.filter((s) => s.isFirst)).toHaveLength(2)
  })

  it('inserta el corte PRÓXIMOS una sola vez, en la posición cronológica correcta', () => {
    const items = buildCompetitionListItems(
      [
        fixture({
          id: 'am',
          kickoff: '2026-04-18T10:00:00Z',
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
        }),
        fixture({ id: 'pm', kickoff: '2026-04-18T20:00:00Z', status: 'scheduled' }),
      ],
      NOW,
    )
    const banners = items.filter((item) => item.type === 'proximos-banner')
    expect(banners).toHaveLength(1)
    // El mismo día solo tiene un encabezado de día, no dos, aunque el corte lo parta.
    const dayHeaders = items.filter((item) => item.type === 'day-header')
    expect(dayHeaders).toHaveLength(1)
    // Entre partidos y corte, el orden relativo es: partido, corte, partido.
    const relevant = items
      .filter((item) => item.type === 'fixture' || item.type === 'proximos-banner')
      .map((item) => item.type)
    expect(relevant).toEqual(['fixture', 'proximos-banner', 'fixture'])
  })

  it('no inserta corte si todo ya se jugó o todo está por jugarse', () => {
    const allPast = buildCompetitionListItems(
      [
        fixture({
          id: '1',
          kickoff: '2026-04-16T15:00:00Z',
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
        }),
      ],
      NOW,
    )
    expect(allPast.some((item) => item.type === 'proximos-banner')).toBe(false)

    const allFuture = buildCompetitionListItems(
      [fixture({ id: '1', kickoff: '2026-04-20T15:00:00Z', status: 'scheduled' })],
      NOW,
    )
    expect(allFuture.some((item) => item.type === 'proximos-banner')).toBe(false)
  })

  it('agrupa los partidos "a confirmar" (sin fecha) bajo su propio encabezado, sin subencabezado redundante', () => {
    const items = buildCompetitionListItems(
      [fixture({ id: '1', kickoff: null, status: 'tbd' })],
      NOW,
    )
    const header = items.find((item) => item.type === 'day-header')
    expect(header).toMatchObject({ label: 'A confirmar' })
    expect(items.some((item) => item.type === 'time-subheader')).toBe(false)
  })

  it('lista vacía da lista de items vacía', () => {
    expect(buildCompetitionListItems([], NOW)).toEqual([])
  })
})
