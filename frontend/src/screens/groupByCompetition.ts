import { groupPreservingOrder, TBD_LABEL, timeLabelFor } from './groupingShared'
import { sortFixturesChronologically } from '../data/proximosCut'
import type { Competition, Fixture } from '../types/fixture'

export interface TimeSubgroup {
  timeLabel: string
  fixtures: Fixture[]
}

export interface CompetitionGroup {
  competition: Competition
  subgroups: TimeSubgroup[]
}

/**
 * Vista **por torneo** de Inicio (RF-008, docs/design.md § 7.1): agrupa por
 * competición y, dentro de cada una, por horario. El orden de los grupos de
 * competición es el de primera aparición en `fixtures` (no hay jerarquía de
 * competiciones definida); dentro de cada competición, los subgrupos de
 * horario van cronológicos, con "A confirmar" al final.
 */
export function groupFixturesByCompetition(fixtures: Fixture[]): CompetitionGroup[] {
  const sorted = sortFixturesChronologically(fixtures)
  return groupPreservingOrder(sorted, (fixture) => fixture.competition.id).map(({ items }) => ({
    competition: items[0].competition,
    subgroups: groupPreservingOrder(items, timeLabelFor, TBD_LABEL).map(({ key, items: subItems }) => ({
      timeLabel: key,
      fixtures: subItems,
    })),
  }))
}
