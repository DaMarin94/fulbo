import type { Competition, Fixture } from '../types/fixture'

export interface CompetitionGroup {
  competition: Competition
  fixtures: Fixture[]
}

/**
 * Agrupa por competición (docs/design.md § 7.1, Inicio). El orden de los
 * grupos es el de primera aparición en `fixtures` — no hay una jerarquía de
 * competiciones definida en la doc, así que no se inventa una.
 */
export function groupFixturesByCompetition(fixtures: Fixture[]): CompetitionGroup[] {
  const groups = new Map<string, CompetitionGroup>()
  for (const fixture of fixtures) {
    const existing = groups.get(fixture.competition.id)
    if (existing) {
      existing.fixtures.push(fixture)
    } else {
      groups.set(fixture.competition.id, { competition: fixture.competition, fixtures: [fixture] })
    }
  }
  return Array.from(groups.values())
}
