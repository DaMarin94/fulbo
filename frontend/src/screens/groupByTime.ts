import { groupPreservingOrder, TBD_LABEL, timeLabelFor } from './groupingShared'
import { sortFixturesChronologically } from '../data/proximosCut'
import type { Competition, Fixture } from '../types/fixture'

export interface CompetitionSubgroup {
  competition: Competition
  fixtures: Fixture[]
}

export interface TimeGroup {
  timeLabel: string
  subgroups: CompetitionSubgroup[]
}

/**
 * Vista **por horario** de Inicio (RF-008, docs/design.md § 7.1): agrupa por
 * hora de inicio y, dentro de cada hora, por competición. Los grupos de
 * horario van cronológicos, con "A confirmar" al final (mismo criterio que
 * `groupByCompetition`); dentro de cada hora, las competiciones van en orden
 * de primera aparición.
 */
export function groupFixturesByTime(fixtures: Fixture[]): TimeGroup[] {
  const sorted = sortFixturesChronologically(fixtures)
  return groupPreservingOrder(sorted, timeLabelFor, TBD_LABEL).map(({ key, items }) => ({
    timeLabel: key,
    subgroups: groupPreservingOrder(items, (fixture) => fixture.competition.id).map(
      ({ items: subItems }) => ({
        competition: subItems[0].competition,
        fixtures: subItems,
      }),
    ),
  }))
}
