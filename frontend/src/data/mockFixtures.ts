import { addDays, toLocalDateKey } from '../lib/dateFormat'
import type { Competition, Fixture, Team } from '../types/fixture'

/**
 * Datos mock locales, tipados según docs/data-model.md, hasta que exista el backend
 * real (docs/architecture.md: el backend depende de un relevamiento pendiente de la
 * API real de API-Football). `src/data/fixturesApi.ts` es la única capa que lee de
 * este archivo; ningún componente de pantalla lo importa directo.
 *
 * --- Cómo forzar cada uno de los tres estados de pantalla (§ 6 docs/design.md) ---
 * Cargando: lo da la latencia simulada de `fixturesApi.ts` en cualquier llamada.
 * Vacío:    pedí `MOCK_EMPTY_DATE` / `MOCK_EMPTY_COMPETITION_ID` / `MOCK_EMPTY_TEAM_ID`.
 * Error:    pedí `MOCK_ERROR_DATE` / `MOCK_ERROR_COMPETITION_ID` / `MOCK_ERROR_TEAM_ID`.
 * (No existe un cuarto estado de "cuota agotada" — RF-006, § 6 de design.md.)
 *
 * --- Por qué las fechas son relativas a "hoy" y no fijas ---
 * Para que la demo y el corte PRÓXIMOS (§ 7.6) sigan siendo representativos sin
 * importar cuándo se corra la app o los tests: todo se ancla con `addDays` a
 * partir del momento en que este módulo se carga, nunca a una fecha absoluta
 * hardcodeada. La lógica que de verdad importa (RN-005, el corte PRÓXIMOS) se
 * testea aparte con una fecha de referencia inyectada (`dateFormat.test.ts`,
 * `proximosCut.test.ts`); acá solo hace falta que los datos "tengan sentido".
 */

export const MOCK_EMPTY_DATE = '2099-01-01'
export const MOCK_ERROR_DATE = '2099-01-02'
export const MOCK_EMPTY_COMPETITION_ID = 'mock-empty-competition'
export const MOCK_ERROR_COMPETITION_ID = 'mock-error-competition'
export const MOCK_EMPTY_TEAM_ID = 'mock-empty-team'
export const MOCK_ERROR_TEAM_ID = 'mock-error-team'

/** Las tres competiciones cubiertas por la v1 (docs/requirements.md). */
export const PRIMERA_A: Competition = {
  id: 'primera-a',
  name: 'Primera A — Argentina',
  shortName: 'PRIMERA A',
}
export const LIBERTADORES: Competition = {
  id: 'libertadores',
  name: 'Copa Libertadores',
  shortName: 'LIBERTADORES',
}
export const SUDAMERICANA: Competition = {
  id: 'sudamericana',
  name: 'Copa Sudamericana',
  shortName: 'SUDAMERICANA',
}

const teams = {
  river: { id: 'river-plate', name: 'River Plate' },
  boca: { id: 'boca-juniors', name: 'Boca Juniors' },
  racing: { id: 'racing-club', name: 'Racing Club' },
  independiente: { id: 'independiente', name: 'Independiente' },
  // Nombre con sufijo desambiguador entre paréntesis — casos de prueba de § 7.5.
  centralCordoba: { id: 'central-cordoba-sde', name: 'Central Córdoba (SdE)' },
  gimnasiaLP: { id: 'gimnasia-esgrima-lp', name: 'Gimnasia y Esgrima (LP)' },
  talleres: { id: 'talleres', name: 'Talleres' },
  velez: { id: 'velez-sarsfield', name: 'Vélez Sarsfield' },
  flamengo: { id: 'flamengo', name: 'Flamengo' },
  palmeiras: { id: 'palmeiras', name: 'Palmeiras' },
  penarol: { id: 'penarol', name: 'Peñarol' },
  nacional: { id: 'nacional', name: 'Nacional' },
  saoPaulo: { id: 'sao-paulo', name: 'São Paulo' },
  // Nombre largo sin sufijo, para probar el truncado simple.
  defensaJusticia: { id: 'defensa-y-justicia', name: 'Club Social y Deportivo Defensa y Justicia' },
} as const satisfies Record<string, Team>

/** Equipo favorito de demo (RF-005): en la v1 real esto lo fija el backend, fuera de la UI. */
export const FAVORITE_TEAM_ID = teams.river.id

let fixtureCounter = 0
function nextId(): string {
  fixtureCounter += 1
  return `mock-fixture-${fixtureCounter}`
}

function buildFixture(partial: Omit<Fixture, 'id'>): Fixture {
  return { id: nextId(), ...partial }
}

/** Instante ISO a una hora local dada, `dayOffset` días desde hoy. */
function isoAt(dayOffset: number, hour: number, minute = 0): string {
  const date = new Date()
  date.setHours(hour, minute, 0, 0)
  return addDays(date, dayOffset).toISOString()
}

/** Bucket de fecha local (YYYY-MM-DD) que consulta `getFixturesByDate`, `dayOffset` días desde hoy. */
function dateKeyAt(dayOffset: number): string {
  return toLocalDateKey(addDays(new Date(), dayOffset))
}

interface MockDay {
  date: string
  fixtures: Fixture[]
}

/**
 * Hoy: día "de demo" con los 8 estados de partido de docs/design.md § 7.2,
 * repartidos en las tres competiciones.
 */
const TODAY_DAY: MockDay = {
  date: dateKeyAt(0),
  fixtures: [
    buildFixture({
      competition: PRIMERA_A,
      homeTeam: teams.river,
      awayTeam: teams.boca,
      kickoff: isoAt(0, 19),
      status: 'scheduled',
      minute: null,
      homeScore: null,
      awayScore: null,
    }),
    buildFixture({
      competition: PRIMERA_A,
      homeTeam: teams.racing,
      awayTeam: teams.independiente,
      kickoff: isoAt(0, 15),
      status: 'live',
      minute: 68,
      homeScore: 1,
      awayScore: 1,
    }),
    buildFixture({
      competition: PRIMERA_A,
      homeTeam: teams.talleres,
      awayTeam: teams.velez,
      kickoff: isoAt(0, 17),
      status: 'halftime',
      minute: 45,
      homeScore: 0,
      awayScore: 0,
    }),
    buildFixture({
      competition: PRIMERA_A,
      homeTeam: teams.centralCordoba,
      awayTeam: teams.gimnasiaLP,
      kickoff: isoAt(0, 13),
      status: 'finished',
      minute: null,
      homeScore: 2,
      awayScore: 0,
    }),
    buildFixture({
      competition: LIBERTADORES,
      homeTeam: teams.flamengo,
      awayTeam: teams.palmeiras,
      kickoff: isoAt(0, 21),
      status: 'postponed',
      minute: null,
      homeScore: null,
      awayScore: null,
    }),
    buildFixture({
      competition: LIBERTADORES,
      homeTeam: teams.saoPaulo,
      awayTeam: teams.defensaJusticia,
      kickoff: isoAt(0, 16),
      status: 'suspended',
      minute: 57,
      homeScore: 1,
      awayScore: 0,
    }),
    buildFixture({
      competition: SUDAMERICANA,
      homeTeam: teams.penarol,
      awayTeam: teams.nacional,
      kickoff: isoAt(0, 18),
      status: 'cancelled',
      minute: null,
      homeScore: null,
      awayScore: null,
    }),
    buildFixture({
      competition: SUDAMERICANA,
      homeTeam: teams.boca,
      awayTeam: teams.penarol,
      kickoff: null,
      status: 'tbd',
      minute: null,
      homeScore: null,
      awayScore: null,
    }),
  ],
}

/** Ayer: un partido finalizado en empate, para variar los casos en Competición/Equipo. */
const YESTERDAY_DAY: MockDay = {
  date: dateKeyAt(-1),
  fixtures: [
    buildFixture({
      competition: PRIMERA_A,
      homeTeam: teams.boca,
      awayTeam: teams.river,
      kickoff: isoAt(-1, 18),
      status: 'finished',
      minute: null,
      homeScore: 1,
      awayScore: 1,
    }),
  ],
}

/** Dentro de dos días: partidos programados, para ejercitar el corte PRÓXIMOS (§ 7.6). */
const IN_TWO_DAYS: MockDay = {
  date: dateKeyAt(2),
  fixtures: [
    buildFixture({
      competition: PRIMERA_A,
      homeTeam: teams.river,
      awayTeam: teams.racing,
      kickoff: isoAt(2, 19),
      status: 'scheduled',
      minute: null,
      homeScore: null,
      awayScore: null,
    }),
    buildFixture({
      competition: LIBERTADORES,
      homeTeam: teams.flamengo,
      awayTeam: teams.saoPaulo,
      kickoff: isoAt(2, 21),
      status: 'scheduled',
      minute: null,
      homeScore: null,
      awayScore: null,
    }),
  ],
}

/** Más lejos en el futuro: para que Competición/Equipo tengan más de un "próximo". */
const IN_NINE_DAYS: MockDay = {
  date: dateKeyAt(9),
  fixtures: [
    buildFixture({
      competition: PRIMERA_A,
      homeTeam: teams.boca,
      awayTeam: teams.talleres,
      kickoff: isoAt(9, 19),
      status: 'scheduled',
      minute: null,
      homeScore: null,
      awayScore: null,
    }),
    buildFixture({
      competition: PRIMERA_A,
      homeTeam: teams.centralCordoba,
      awayTeam: teams.velez,
      kickoff: isoAt(9, 15),
      status: 'scheduled',
      minute: null,
      homeScore: null,
      awayScore: null,
    }),
  ],
}

export const MOCK_DAYS: MockDay[] = [YESTERDAY_DAY, TODAY_DAY, IN_TWO_DAYS, IN_NINE_DAYS]

export const MOCK_ALL_FIXTURES: Fixture[] = MOCK_DAYS.flatMap((day) => day.fixtures)

export function findFixturesByDate(date: string): Fixture[] {
  return MOCK_DAYS.find((day) => day.date === date)?.fixtures ?? []
}

export function findFixturesByCompetition(competitionId: string): Fixture[] {
  return MOCK_ALL_FIXTURES.filter((fixture) => fixture.competition.id === competitionId)
}

export function findFixturesByTeam(teamId: string): Fixture[] {
  return MOCK_ALL_FIXTURES.filter(
    (fixture) => fixture.homeTeam.id === teamId || fixture.awayTeam.id === teamId,
  )
}

const COMPETITION_REGISTRY: Record<string, Competition> = {
  [PRIMERA_A.id]: PRIMERA_A,
  [LIBERTADORES.id]: LIBERTADORES,
  [SUDAMERICANA.id]: SUDAMERICANA,
  [MOCK_EMPTY_COMPETITION_ID]: {
    id: MOCK_EMPTY_COMPETITION_ID,
    name: 'Competición sin partidos (mock)',
    shortName: 'SIN PARTIDOS',
  },
  [MOCK_ERROR_COMPETITION_ID]: {
    id: MOCK_ERROR_COMPETITION_ID,
    name: 'Competición con error (mock)',
    shortName: 'ERROR',
  },
}

const TEAM_REGISTRY: Record<string, Team> = {
  ...Object.fromEntries(Object.values(teams).map((team) => [team.id, team])),
  [MOCK_EMPTY_TEAM_ID]: { id: MOCK_EMPTY_TEAM_ID, name: 'Equipo sin partidos (mock)' },
  [MOCK_ERROR_TEAM_ID]: { id: MOCK_ERROR_TEAM_ID, name: 'Equipo con error (mock)' },
}

/**
 * Metadata de competición por id — hoy una tabla fija (son tres competiciones
 * cerradas en la v1, § 7.3); el día que exista el backend, este lookup se vuelve
 * un endpoint real, sin cambiar la firma que consume `fixturesApi.ts`.
 */
export function findCompetitionById(id: string): Competition | undefined {
  return COMPETITION_REGISTRY[id]
}

export function findTeamById(id: string): Team | undefined {
  return TEAM_REGISTRY[id]
}
