import { findProximosCutIndex, sortFixturesChronologically } from '../data/proximosCut'
import type { Fixture } from '../types/fixture'

export type TeamListItem =
  | { type: 'proximos-banner'; key: string }
  | { type: 'fixture'; key: string; fixture: Fixture }

/**
 * Arma la lista de Equipo (docs/design.md § 10.3): plana, cronológica
 * ascendente, sin agrupar (§ 7.1), con el corte `PRÓXIMOS` (§ 7.6). Cada fila
 * lleva su propia meta-línea (fecha + hora + competición): `MatchRow` la
 * deriva directo del `Fixture`, así que este armador no formatea nada de
 * presentación.
 */
export function buildTeamListItems(fixtures: Fixture[], now: Date = new Date()): TeamListItem[] {
  const sorted = sortFixturesChronologically(fixtures)
  const cutIndex = findProximosCutIndex(sorted, now)
  const items: TeamListItem[] = []

  sorted.forEach((fixture, index) => {
    if (index === cutIndex) {
      items.push({ type: 'proximos-banner', key: 'proximos' })
    }
    items.push({ type: 'fixture', key: fixture.id, fixture })
  })

  return items
}
