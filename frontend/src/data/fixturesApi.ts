import { FixturesFetchError } from './errors'
import {
  FAVORITE_TEAM_ID,
  findCompetitionById,
  findFixturesByCompetition,
  findFixturesByDate,
  findFixturesByTeam,
  findTeamById,
  MOCK_ERROR_COMPETITION_ID,
  MOCK_ERROR_DATE,
  MOCK_ERROR_TEAM_ID,
} from './mockFixtures'
import type { Competition, Fixture, Team } from '../types/fixture'

/**
 * Capa de acceso a datos de fixtures. Misma forma (funciones async) que va a
 * tener cuando hable con el backend real (docs/architecture.md: el backend está
 * pendiente de un relevamiento de la API real). Por dentro, hoy lee de mocks
 * locales con latencia simulada; el día que el backend exista, cambiar el cuerpo
 * de estas funciones por `fetch` a través de la capa central de HTTP
 * (`src/data/apiRequest.ts`, docs/technical.md § Manejo de errores) es mecánico
 * y no toca ningún componente de pantalla — ninguno importa `mockFixtures.ts`
 * directo, todos pasan por los hooks de `src/data/hooks/*`.
 */

/** Latencia simulada de red, para poder ver/testear el estado Cargando. */
const MOCK_LATENCY_MS = 300

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), MOCK_LATENCY_MS)
  })
}

/** RF-001 — partidos de un día (todas las competiciones), fecha en formato YYYY-MM-DD. */
export async function getFixturesByDate(date: string): Promise<Fixture[]> {
  if (date === MOCK_ERROR_DATE) {
    await delay(null)
    throw new FixturesFetchError()
  }
  return delay(findFixturesByDate(date))
}

/** RF-003 — todos los partidos de una competición. */
export async function getFixturesByCompetition(competitionId: string): Promise<Fixture[]> {
  if (competitionId === MOCK_ERROR_COMPETITION_ID) {
    await delay(null)
    throw new FixturesFetchError()
  }
  return delay(findFixturesByCompetition(competitionId))
}

/** RF-004 / RF-005 — fixture propio de un equipo (incluido el favorito). */
export async function getFixturesByTeam(teamId: string): Promise<Fixture[]> {
  if (teamId === MOCK_ERROR_TEAM_ID) {
    await delay(null)
    throw new FixturesFetchError()
  }
  return delay(findFixturesByTeam(teamId))
}

/** Metadata de una competición (nombre completo + forma corta) para el título de su pantalla. */
export async function getCompetitionById(competitionId: string): Promise<Competition | null> {
  return delay(findCompetitionById(competitionId) ?? null)
}

/** Metadata de un equipo (nombre) para el título de su pantalla. */
export async function getTeamById(teamId: string): Promise<Team | null> {
  return delay(findTeamById(teamId) ?? null)
}

/**
 * RF-005 — id del equipo favorito, "fijado fuera de la UI (configuración del
 * backend)". No existe ese backend todavía: mientras tanto esto simula el
 * endpoint de configuración que algún día lo va a servir, para que `Mi equipo`
 * (Inicio) no dependa de un valor importado a mano en un componente.
 */
export async function getFavoriteTeamId(): Promise<string> {
  return delay(FAVORITE_TEAM_ID)
}
