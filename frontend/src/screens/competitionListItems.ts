import { findProximosCutIndex, sortFixturesChronologically } from '../data/proximosCut'
import { formatAbsoluteDate, toLocalDateKey } from '../lib/dateFormat'
import type { Fixture } from '../types/fixture'

export type CompetitionListItem =
  | { type: 'day-header'; key: string; label: string }
  | { type: 'proximos-banner'; key: string }
  | { type: 'fixture'; key: string; fixture: Fixture }

/**
 * Arma la lista de Competición (docs/design.md § 10.2): agrupada por fecha
 * (§ 7.1), con el corte `PRÓXIMOS` insertado **una sola vez** sobre el eje
 * temporal completo (§ 7.6) — no por grupo, aunque el corte caiga en medio de
 * un día con partidos ya jugados y por jugar el mismo día.
 *
 * Los partidos "a confirmar" (sin `kickoff`) no tienen día calendario: se
 * agrupan bajo un encabezado propio ("A confirmar"), al final — caso no
 * cubierto en docs/design.md (asume fecha siempre conocida), documentado en
 * el reporte de esta etapa.
 */
export function buildCompetitionListItems(
  fixtures: Fixture[],
  now: Date = new Date(),
): CompetitionListItem[] {
  const sorted = sortFixturesChronologically(fixtures)
  const cutIndex = findProximosCutIndex(sorted, now)
  const items: CompetitionListItem[] = []
  let lastDateKey: string | null = null

  sorted.forEach((fixture, index) => {
    if (index === cutIndex) {
      items.push({ type: 'proximos-banner', key: 'proximos' })
    }
    const dateKey = fixture.kickoff ? toLocalDateKey(new Date(fixture.kickoff)) : 'tbd'
    if (dateKey !== lastDateKey) {
      items.push({
        type: 'day-header',
        key: `day-${dateKey}`,
        label: fixture.kickoff ? formatAbsoluteDate(new Date(fixture.kickoff), now) : 'A confirmar',
      })
      lastDateKey = dateKey
    }
    items.push({ type: 'fixture', key: fixture.id, fixture })
  })

  return items
}
