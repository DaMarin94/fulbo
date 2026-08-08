import { describe, expect, it } from 'vitest'
import { getMatchRowPresentation } from './matchRowPresentation'
import type { Fixture } from '../../types/fixture'
import { PRIMERA_A } from '../../data/mockFixtures'

const HOME = { id: 'home', name: 'Local FC' }
const AWAY = { id: 'away', name: 'Away FC' }

function fixture(overrides: Partial<Fixture>): Fixture {
  return {
    id: 'f1',
    competition: PRIMERA_A,
    homeTeam: HOME,
    awayTeam: AWAY,
    kickoff: '2026-08-07T18:00:00Z',
    status: 'scheduled',
    minute: null,
    homeScore: null,
    awayScore: null,
    ...overrides,
  }
}

describe('getMatchRowPresentation', () => {
  it('Programado: sin línea de estado, marcador vacío', () => {
    const p = getMatchRowPresentation(fixture({ status: 'scheduled' }))
    expect(p.statusLine).toBeNull()
    expect(p.home).toBeNull()
    expect(p.away).toBeNull()
  })

  it('En vivo: "En vivo · <minuto>\'" con punto que pulsa, marcador ambos 600', () => {
    const p = getMatchRowPresentation(
      fixture({ status: 'live', minute: 68, homeScore: 1, awayScore: 1 }),
    )
    expect(p.statusLine).toEqual({
      shape: 'dot',
      label: "En vivo · 68'",
      colorClassName: 'text-live',
      pulse: true,
    })
    expect(p.home).toEqual({
      value: 1,
      weightClassName: 'font-semibold',
      colorClassName: 'text-text-1',
    })
    expect(p.away).toEqual({
      value: 1,
      weightClassName: 'font-semibold',
      colorClassName: 'text-text-1',
    })
  })

  it('En vivo sin minuto: no agrega sufijo', () => {
    const p = getMatchRowPresentation(fixture({ status: 'live', minute: null }))
    expect(p.statusLine?.label).toBe('En vivo')
  })

  it('Entretiempo: "Entretiempo" sin minuto (nunca lo lleva), marcador ambos 600', () => {
    const p = getMatchRowPresentation(
      fixture({ status: 'halftime', minute: 45, homeScore: 0, awayScore: 0 }),
    )
    expect(p.statusLine).toEqual({
      shape: 'dot',
      label: 'Entretiempo',
      colorClassName: 'text-live',
      pulse: true,
    })
    expect(p.home?.weightClassName).toBe('font-semibold')
  })

  it('Finalizado con ganador: "Finalizado" (nunca "FIN"), ganador 700 / perdedor 400 + text-2', () => {
    const p = getMatchRowPresentation(fixture({ status: 'finished', homeScore: 2, awayScore: 0 }))
    expect(p.statusLine).toEqual({
      shape: null,
      label: 'Finalizado',
      colorClassName: 'text-text-3',
      pulse: false,
    })
    expect(p.home).toEqual({
      value: 2,
      weightClassName: 'font-bold',
      colorClassName: 'text-text-1',
    })
    expect(p.away).toEqual({
      value: 0,
      weightClassName: 'font-normal',
      colorClassName: 'text-text-2',
    })
  })

  it('Finalizado con visitante ganador: los pesos se invierten', () => {
    const p = getMatchRowPresentation(fixture({ status: 'finished', homeScore: 0, awayScore: 3 }))
    expect(p.home).toEqual({
      value: 0,
      weightClassName: 'font-normal',
      colorClassName: 'text-text-2',
    })
    expect(p.away).toEqual({
      value: 3,
      weightClassName: 'font-bold',
      colorClassName: 'text-text-1',
    })
  })

  it('Finalizado en empate: ambos 500, sin distinción de color', () => {
    const p = getMatchRowPresentation(fixture({ status: 'finished', homeScore: 1, awayScore: 1 }))
    expect(p.home).toEqual({
      value: 1,
      weightClassName: 'font-medium',
      colorClassName: 'text-text-1',
    })
    expect(p.away).toEqual({
      value: 1,
      weightClassName: 'font-medium',
      colorClassName: 'text-text-1',
    })
  })

  it('Postergado: "Postergado" ámbar diamante, sin marcador', () => {
    const p = getMatchRowPresentation(fixture({ status: 'postponed' }))
    expect(p.statusLine).toEqual({
      shape: 'diamond',
      label: 'Postergado',
      colorClassName: 'text-warn',
      pulse: false,
    })
    expect(p.home).toBeNull()
  })

  it('Suspendido sin minuto ni parcial: "Suspendido", sin marcador', () => {
    const p = getMatchRowPresentation(fixture({ status: 'suspended' }))
    expect(p.statusLine?.label).toBe('Suspendido')
    expect(p.home).toBeNull()
  })

  it('Suspendido con minuto y parcial: minuto separado por medio punto, marcador presente', () => {
    const p = getMatchRowPresentation(
      fixture({ status: 'suspended', minute: 57, homeScore: 1, awayScore: 0 }),
    )
    expect(p.statusLine?.label).toBe("Suspendido · 57'")
    expect(p.home).toEqual({
      value: 1,
      weightClassName: 'font-semibold',
      colorClassName: 'text-text-1',
    })
  })

  it('Cancelado: "Cancelado" ámbar diamante, sin marcador (nunca rojo)', () => {
    const p = getMatchRowPresentation(fixture({ status: 'cancelled' }))
    expect(p.statusLine).toEqual({
      shape: 'diamond',
      label: 'Cancelado',
      colorClassName: 'text-warn',
      pulse: false,
    })
    expect(p.home).toBeNull()
  })

  it('A confirmar: "A confirmar" neutro sin forma, sin marcador', () => {
    const p = getMatchRowPresentation(fixture({ status: 'tbd', kickoff: null }))
    expect(p.statusLine).toEqual({
      shape: null,
      label: 'A confirmar',
      colorClassName: 'text-text-3',
      pulse: false,
    })
    expect(p.home).toBeNull()
  })
})
