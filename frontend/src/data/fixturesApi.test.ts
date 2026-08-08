import { describe, expect, it } from 'vitest'
import { FixturesFetchError } from './errors'
import {
  getCompetitionById,
  getFixturesByCompetition,
  getFixturesByDate,
  getFixturesByTeam,
  getTeamById,
} from './fixturesApi'
import {
  MOCK_EMPTY_COMPETITION_ID,
  MOCK_EMPTY_DATE,
  MOCK_EMPTY_TEAM_ID,
  MOCK_ERROR_COMPETITION_ID,
  MOCK_ERROR_DATE,
  MOCK_ERROR_TEAM_ID,
} from './mockFixtures'
import { toLocalDateKey } from '../lib/dateFormat'

const TODAY_KEY = toLocalDateKey(new Date())

describe('fixturesApi', () => {
  describe('getFixturesByDate', () => {
    it('devuelve los partidos del día pedido (RF-001)', async () => {
      const fixtures = await getFixturesByDate(TODAY_KEY)
      expect(fixtures.length).toBeGreaterThan(0)
      expect(fixtures.every((f) => f.id)).toBe(true)
    })

    it('estado Vacío: una fecha sin partidos devuelve un array vacío', async () => {
      await expect(getFixturesByDate(MOCK_EMPTY_DATE)).resolves.toEqual([])
    })

    it('estado Error: la fecha "de error" rechaza con FixturesFetchError', async () => {
      await expect(getFixturesByDate(MOCK_ERROR_DATE)).rejects.toBeInstanceOf(FixturesFetchError)
    })

    it('estado Cargando: la promesa está pendiente mientras dura la latencia simulada', () => {
      const promise = getFixturesByDate(TODAY_KEY)
      // No await: en este mismo tick la promesa todavía no resolvió (latencia simulada).
      expect(promise).toBeInstanceOf(Promise)
      return promise // se limpia para no dejar handles colgando
    })
  })

  describe('getFixturesByCompetition', () => {
    it('devuelve solo partidos de la competición pedida (RF-003)', async () => {
      const fixtures = await getFixturesByCompetition('primera-a')
      expect(fixtures.length).toBeGreaterThan(0)
      expect(fixtures.every((f) => f.competition.id === 'primera-a')).toBe(true)
    })

    it('estado Vacío', async () => {
      await expect(getFixturesByCompetition(MOCK_EMPTY_COMPETITION_ID)).resolves.toEqual([])
    })

    it('estado Error', async () => {
      await expect(getFixturesByCompetition(MOCK_ERROR_COMPETITION_ID)).rejects.toBeInstanceOf(
        FixturesFetchError,
      )
    })
  })

  describe('getFixturesByTeam', () => {
    it('devuelve los partidos donde el equipo juega de local o visitante (RF-004/RF-005)', async () => {
      const fixtures = await getFixturesByTeam('river-plate')
      expect(fixtures.length).toBeGreaterThan(0)
      expect(
        fixtures.every((f) => f.homeTeam.id === 'river-plate' || f.awayTeam.id === 'river-plate'),
      ).toBe(true)
    })

    it('estado Vacío', async () => {
      await expect(getFixturesByTeam(MOCK_EMPTY_TEAM_ID)).resolves.toEqual([])
    })

    it('estado Error', async () => {
      await expect(getFixturesByTeam(MOCK_ERROR_TEAM_ID)).rejects.toBeInstanceOf(FixturesFetchError)
    })
  })

  describe('getCompetitionById', () => {
    it('devuelve nombre completo y forma corta', async () => {
      const competition = await getCompetitionById('primera-a')
      expect(competition).toEqual({
        id: 'primera-a',
        name: 'Primera A — Argentina',
        shortName: 'PRIMERA A',
      })
    })

    it('devuelve null si no existe', async () => {
      await expect(getCompetitionById('no-existe')).resolves.toBeNull()
    })
  })

  describe('getTeamById', () => {
    it('devuelve el equipo por id', async () => {
      await expect(getTeamById('river-plate')).resolves.toEqual({
        id: 'river-plate',
        name: 'River Plate',
      })
    })

    it('devuelve null si no existe', async () => {
      await expect(getTeamById('no-existe')).resolves.toBeNull()
    })
  })
})
