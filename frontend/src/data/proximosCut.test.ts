import { describe, expect, it } from 'vitest'
import {
  findProximosCutIndex,
  isFixtureBeforeCut,
  sortFixturesChronologically,
} from './proximosCut'
import type { Fixture } from '../types/fixture'
import { PRIMERA_A } from './mockFixtures'

const TEAM_A = { id: 'a', name: 'Equipo A' }
const TEAM_B = { id: 'b', name: 'Equipo B' }
const NOW = new Date(2026, 3, 18, 12, 0) // sábado 18 de abril de 2026, mediodía

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

describe('isFixtureBeforeCut', () => {
  it('un partido de un día anterior siempre está antes del corte, sin importar el estado', () => {
    const yesterdayLive = fixture({ kickoff: '2026-04-17T15:00:00Z', status: 'live' })
    expect(isFixtureBeforeCut(yesterdayLive, NOW)).toBe(true)
  })

  it('un partido de un día futuro nunca está antes del corte', () => {
    const tomorrowFinished = fixture({ kickoff: '2026-04-19T15:00:00Z', status: 'finished' })
    // "finished" no es realista a futuro, pero la regla es por día calendario primero.
    expect(isFixtureBeforeCut(tomorrowFinished, NOW)).toBe(false)
  })

  it('hoy, finalizado o cancelado: antes del corte', () => {
    expect(isFixtureBeforeCut(fixture({ status: 'finished' }), NOW)).toBe(true)
    expect(isFixtureBeforeCut(fixture({ status: 'cancelled' }), NOW)).toBe(true)
  })

  it('hoy, cualquier otro estado: después del corte (no depende de la hora del día)', () => {
    expect(isFixtureBeforeCut(fixture({ status: 'scheduled' }), NOW)).toBe(false)
    expect(isFixtureBeforeCut(fixture({ status: 'live' }), NOW)).toBe(false)
    expect(isFixtureBeforeCut(fixture({ status: 'postponed' }), NOW)).toBe(false)
  })

  it('"a confirmar" (sin hora) nunca está antes del corte', () => {
    expect(isFixtureBeforeCut(fixture({ status: 'tbd', kickoff: null }), NOW)).toBe(false)
  })
})

describe('sortFixturesChronologically', () => {
  it('ordena ascendente por kickoff', () => {
    const late = fixture({ id: 'late', kickoff: '2026-04-20T15:00:00Z' })
    const early = fixture({ id: 'early', kickoff: '2026-04-16T15:00:00Z' })
    const mid = fixture({ id: 'mid', kickoff: '2026-04-18T15:00:00Z' })
    expect(sortFixturesChronologically([late, early, mid]).map((f) => f.id)).toEqual([
      'early',
      'mid',
      'late',
    ])
  })

  it('los partidos sin hora (tbd) van al final', () => {
    const tbd = fixture({ id: 'tbd', kickoff: null, status: 'tbd' })
    const dated = fixture({ id: 'dated', kickoff: '2026-04-16T15:00:00Z' })
    expect(sortFixturesChronologically([tbd, dated]).map((f) => f.id)).toEqual(['dated', 'tbd'])
  })

  it('no muta el array original', () => {
    const original = [
      fixture({ id: 'b', kickoff: '2026-04-20T00:00:00Z' }),
      fixture({ id: 'a', kickoff: '2026-04-16T00:00:00Z' }),
    ]
    const originalOrder = original.map((f) => f.id)
    sortFixturesChronologically(original)
    expect(original.map((f) => f.id)).toEqual(originalOrder)
  })
})

describe('findProximosCutIndex', () => {
  it('devuelve el índice del primer partido "que viene"', () => {
    const sorted = sortFixturesChronologically([
      fixture({ id: 'past1', kickoff: '2026-04-16T15:00:00Z', status: 'finished' }),
      fixture({ id: 'past2', kickoff: '2026-04-17T15:00:00Z', status: 'finished' }),
      fixture({ id: 'next1', kickoff: '2026-04-19T15:00:00Z', status: 'scheduled' }),
      fixture({ id: 'next2', kickoff: '2026-04-20T15:00:00Z', status: 'scheduled' }),
    ])
    expect(findProximosCutIndex(sorted, NOW)).toBe(2)
  })

  it('null cuando todos los partidos ya se jugaron', () => {
    const sorted = sortFixturesChronologically([
      fixture({ id: 'a', kickoff: '2026-04-16T15:00:00Z', status: 'finished' }),
      fixture({ id: 'b', kickoff: '2026-04-17T15:00:00Z', status: 'finished' }),
    ])
    expect(findProximosCutIndex(sorted, NOW)).toBeNull()
  })

  it('null cuando todos los partidos están por jugarse', () => {
    const sorted = sortFixturesChronologically([
      fixture({ id: 'a', kickoff: '2026-04-19T15:00:00Z', status: 'scheduled' }),
      fixture({ id: 'b', kickoff: '2026-04-20T15:00:00Z', status: 'scheduled' }),
    ])
    expect(findProximosCutIndex(sorted, NOW)).toBeNull()
  })

  it('null con una lista vacía', () => {
    expect(findProximosCutIndex([], NOW)).toBeNull()
  })
})
