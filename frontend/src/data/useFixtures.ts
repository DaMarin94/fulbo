import { apiRequest } from './apiRequest'
import {
  getCompetitionById,
  getFavoriteTeamId,
  getFixturesByCompetition,
  getFixturesByDate,
  getFixturesByTeam,
  getTeamById,
} from './fixturesApi'
import { useAsync } from './useAsync'

/** RF-001 — partidos del día elegido (Inicio). */
export function useFixturesByDate(date: string) {
  return useAsync(
    () =>
      apiRequest(() => getFixturesByDate(date), {
        errorMessage: 'No pudimos cargar los partidos.',
      }),
    [date],
  )
}

/** RF-003 — partidos de una competición. */
export function useFixturesByCompetition(competitionId: string) {
  return useAsync(
    () =>
      apiRequest(() => getFixturesByCompetition(competitionId), {
        errorMessage: 'No pudimos cargar los partidos.',
      }),
    [competitionId],
  )
}

/** RF-004 / RF-005 — fixture de un equipo (incluido el favorito). */
export function useFixturesByTeam(teamId: string) {
  return useAsync(
    () =>
      apiRequest(() => getFixturesByTeam(teamId), {
        errorMessage: 'No pudimos cargar los partidos.',
      }),
    [teamId],
  )
}

/** Nombre de una competición, para el título del encabezado (§ 10.2). Sin toast: es metadata de cromo, no la lista. */
export function useCompetitionById(competitionId: string) {
  return useAsync(
    () => apiRequest(() => getCompetitionById(competitionId), { silent: true }),
    [competitionId],
  )
}

/** Nombre de un equipo, para el título del encabezado (§ 10.3). Sin toast, mismo motivo. */
export function useTeamById(teamId: string) {
  return useAsync(() => apiRequest(() => getTeamById(teamId), { silent: true }), [teamId])
}

/** RF-005 — id del equipo favorito, para el acceso "Mi equipo" de Inicio. */
export function useFavoriteTeamId() {
  return useAsync(() => apiRequest(() => getFavoriteTeamId(), { silent: true }), [])
}
