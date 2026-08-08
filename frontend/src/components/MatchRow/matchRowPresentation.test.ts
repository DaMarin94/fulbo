import { describe, expect, it } from 'vitest'
import { formatKickoffTime, getMatchRowPresentation } from './matchRowPresentation'
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

describe('formatKickoffTime', () => {
  it('devuelve "—" cuando no hay hora (a confirmar)', () => {
    expect(formatKickoffTime(null)).toBe('—')
  })

  it('formatea la hora en formato HH:mm de 24hs', () => {
    expect(formatKickoffTime('2026-08-07T18:00:00Z')).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe('getMatchRowPresentation', () => {
  it('Programado: sin franja, sin sub-línea, marcador vacío, sin fila 3 (§ 8.4)', () => {
    const p = getMatchRowPresentation(fixture({ status: 'scheduled' }))
    expect(p.statusBadge).toBeNull()
    expect(p.subLine).toBeNull()
    expect(p.wideStatusWord).toBeNull()
    expect(p.home).toBeNull()
    expect(p.away).toBeNull()
  })

  it('En vivo: franja EN VIVO con punto que pulsa, minuto en sub-línea, marcador ambos 600', () => {
    const p = getMatchRowPresentation(
      fixture({ status: 'live', minute: 68, homeScore: 1, awayScore: 1 }),
    )
    expect(p.statusBadge).toEqual({
      shape: 'dot',
      label: 'EN VIVO',
      colorClassName: 'text-live',
      pulse: true,
    })
    expect(p.subLine).toEqual({ text: "68'", colorClassName: 'text-live' })
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

  it('En vivo — fila 3 amplia (§ 8.4): el minuto se embebe en el propio texto', () => {
    const p = getMatchRowPresentation(fixture({ status: 'live', minute: 68 }))
    expect(p.wideStatusWord).toEqual({
      shape: 'dot',
      label: "EN VIVO · 68'",
      colorClassName: 'text-live',
      pulse: true,
    })
  })

  it('En vivo sin minuto: la fila 3 amplia no agrega sufijo', () => {
    const p = getMatchRowPresentation(fixture({ status: 'live', minute: null }))
    expect(p.wideStatusWord?.label).toBe('EN VIVO')
  })

  it('Entretiempo: franja ENTRETIEMPO, sub-línea "ENTR.", marcador ambos 600, sin minuto en fila 3', () => {
    const p = getMatchRowPresentation(
      fixture({ status: 'halftime', minute: 45, homeScore: 0, awayScore: 0 }),
    )
    expect(p.statusBadge?.label).toBe('ENTRETIEMPO')
    expect(p.subLine).toEqual({ text: 'ENTR.', colorClassName: 'text-live' })
    expect(p.home?.weightClassName).toBe('font-semibold')
    expect(p.wideStatusWord?.label).toBe('ENTRETIEMPO')
  })

  it('Finalizado con ganador: sin franja compacta, sub-línea FIN, ganador 700 / perdedor 400 + text-2', () => {
    const p = getMatchRowPresentation(fixture({ status: 'finished', homeScore: 2, awayScore: 0 }))
    expect(p.statusBadge).toBeNull()
    expect(p.subLine).toEqual({ text: 'FIN', colorClassName: 'text-text-3' })
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

  it('Finalizado — fila 3 amplia: "FIN" sin forma, aunque compacta no lleve franja', () => {
    const p = getMatchRowPresentation(fixture({ status: 'finished', homeScore: 2, awayScore: 0 }))
    expect(p.wideStatusWord).toEqual({
      shape: null,
      label: 'FIN',
      colorClassName: 'text-text-3',
      pulse: false,
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

  it('Postergado: franja ámbar diamante, sin sub-línea, sin marcador, misma franja en fila 3', () => {
    const p = getMatchRowPresentation(fixture({ status: 'postponed' }))
    expect(p.statusBadge).toEqual({
      shape: 'diamond',
      label: 'POSTERGADO',
      colorClassName: 'text-warn',
      pulse: false,
    })
    expect(p.subLine).toBeNull()
    expect(p.home).toBeNull()
    expect(p.wideStatusWord).toEqual(p.statusBadge)
  })

  it('Suspendido sin minuto ni parcial: franja "SUSPENDIDO", sin marcador', () => {
    const p = getMatchRowPresentation(fixture({ status: 'suspended' }))
    expect(p.statusBadge?.label).toBe('SUSPENDIDO')
    expect(p.home).toBeNull()
    expect(p.wideStatusWord?.label).toBe('SUSPENDIDO')
  })

  it('Suspendido con minuto y parcial: franja con minuto separado por medio punto, marcador presente', () => {
    const p = getMatchRowPresentation(
      fixture({ status: 'suspended', minute: 57, homeScore: 1, awayScore: 0 }),
    )
    expect(p.statusBadge?.label).toBe("SUSPENDIDO · 57'")
    expect(p.wideStatusWord?.label).toBe("SUSPENDIDO · 57'")
    expect(p.home).toEqual({
      value: 1,
      weightClassName: 'font-semibold',
      colorClassName: 'text-text-1',
    })
  })

  it('Cancelado: franja ámbar diamante, sin marcador (nunca rojo)', () => {
    const p = getMatchRowPresentation(fixture({ status: 'cancelled' }))
    expect(p.statusBadge).toEqual({
      shape: 'diamond',
      label: 'CANCELADO',
      colorClassName: 'text-warn',
      pulse: false,
    })
    expect(p.home).toBeNull()
    expect(p.wideStatusWord).toEqual(p.statusBadge)
  })

  it('A confirmar: hora "—", franja neutra sin forma, sin marcador, misma franja en fila 3', () => {
    const p = getMatchRowPresentation(fixture({ status: 'tbd', kickoff: null }))
    expect(p.timeLabel).toBe('—')
    expect(p.timeColorClassName).toBe('text-text-3')
    expect(p.statusBadge).toEqual({
      shape: null,
      label: 'A CONFIRMAR',
      colorClassName: 'text-text-2',
      pulse: false,
    })
    expect(p.home).toBeNull()
    expect(p.wideStatusWord).toEqual(p.statusBadge)
  })
})
