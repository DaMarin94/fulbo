import { findProximosCutIndex, sortFixturesChronologically } from '../data/proximosCut'
import { formatShortNumericDate } from '../lib/dateFormat'
import type { Fixture } from '../types/fixture'

export type TeamListItem =
  | { type: 'proximos-banner'; key: string }
  | { type: 'fixture'; key: string; fixture: Fixture; dateLabel: string }

/**
 * Arma la lista de Equipo (docs/design.md § 10.3): plana, cronológica
 * ascendente, sin agrupar (§ 7.1), con el corte `PRÓXIMOS` (§ 7.6) y la
 * fecha de la meta-línea ya formateada (forma numérica corta, "dom 19/04";
 * "—" para "a confirmar", sin fecha conocida — no cubierto explícitamente en
 * design.md, documentado en el reporte de esta etapa).
 */
export function buildTeamListItems(fixtures: Fixture[], now: Date = new Date()): TeamListItem[] {
  const sorted = sortFixturesChronologically(fixtures)
  const cutIndex = findProximosCutIndex(sorted, now)
  const items: TeamListItem[] = []

  sorted.forEach((fixture, index) => {
    if (index === cutIndex) {
      items.push({ type: 'proximos-banner', key: 'proximos' })
    }
    items.push({
      type: 'fixture',
      key: fixture.id,
      fixture,
      dateLabel: fixture.kickoff ? formatShortNumericDate(new Date(fixture.kickoff)) : '—',
    })
  })

  return items
}
