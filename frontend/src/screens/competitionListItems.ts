import { findProximosCutIndex, sortFixturesChronologically } from '../data/proximosCut'
import { TBD_LABEL, timeLabelFor } from './groupingShared'
import { formatAbsoluteDate, toLocalDateKey } from '../lib/dateFormat'
import type { Fixture } from '../types/fixture'

export type CompetitionListItem =
  | { type: 'day-header'; key: string; label: string; isFirst: boolean }
  | { type: 'time-subheader'; key: string; label: string; isFirst: boolean }
  | { type: 'proximos-banner'; key: string }
  | { type: 'fixture'; key: string; fixture: Fixture }

/**
 * Arma la lista de Competición (docs/design.md § 10.2): agrupada por fecha
 * (titular) y, dentro de cada fecha, subagrupada por horario (subtítulo,
 * § 7.1) — la hora salió del bloque de partido (§ 7.0), así que sin este
 * subnivel no aparecería en ningún lado. El corte `PRÓXIMOS` se inserta **una
 * sola vez** sobre el eje temporal completo (§ 7.6), no por grupo.
 *
 * Los partidos "a confirmar" (sin `kickoff`) van bajo su propio encabezado de
 * día ("A confirmar", al final); no se les agrega además un subencabezado de
 * horario redundante con el mismo texto.
 */
export function buildCompetitionListItems(
  fixtures: Fixture[],
  now: Date = new Date(),
): CompetitionListItem[] {
  const sorted = sortFixturesChronologically(fixtures)
  const cutIndex = findProximosCutIndex(sorted, now)
  const items: CompetitionListItem[] = []
  let lastDateKey: string | null = null
  let lastTimeLabel: string | null = null
  let sawDayHeader = false
  let sawTimeSubheaderInDay = false

  sorted.forEach((fixture, index) => {
    if (index === cutIndex) {
      items.push({ type: 'proximos-banner', key: 'proximos' })
    }
    const dateKey = fixture.kickoff ? toLocalDateKey(new Date(fixture.kickoff)) : 'tbd'
    if (dateKey !== lastDateKey) {
      items.push({
        type: 'day-header',
        key: `day-${dateKey}`,
        label: fixture.kickoff ? formatAbsoluteDate(new Date(fixture.kickoff), now) : TBD_LABEL,
        isFirst: !sawDayHeader,
      })
      sawDayHeader = true
      lastDateKey = dateKey
      lastTimeLabel = null
      sawTimeSubheaderInDay = false
    }
    if (dateKey !== 'tbd') {
      const timeLabel = timeLabelFor(fixture)
      if (timeLabel !== lastTimeLabel) {
        items.push({
          type: 'time-subheader',
          key: `time-${dateKey}-${timeLabel}`,
          label: timeLabel,
          isFirst: !sawTimeSubheaderInDay,
        })
        sawTimeSubheaderInDay = true
        lastTimeLabel = timeLabel
      }
    }
    items.push({ type: 'fixture', key: fixture.id, fixture })
  })

  return items
}
