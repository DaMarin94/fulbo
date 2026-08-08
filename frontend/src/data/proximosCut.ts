import { isSameLocalDay } from '../lib/dateFormat'
import type { Fixture } from '../types/fixture'

/**
 * Corte entre lo jugado y lo que viene (docs/design.md § 7.6), usado por
 * Competición y Equipo: listas cronológicas ascendentes que abren posicionadas
 * en el próximo partido (§ 7.1).
 *
 * Regla de clasificación (no está cerrada al detalle en design.md/data-model.md
 * — es una decisión de `frontend`, documentada acá): un partido está "antes del
 * corte" si:
 * - su día calendario local es estrictamente anterior a `now`, sin importar el
 *   estado (un partido en vivo de ayer no es "lo que viene" hoy); o
 * - es el mismo día calendario que `now` y su estado es terminal
 *   (`finished`/`cancelled`).
 * Todo lo demás (incluido "a confirmar", sin fecha) cuenta como "lo que viene".
 * Comparar por **día calendario** y no por instante exacto evita que la
 * posición del corte dependa de la hora del día en que se lo calcula.
 */
export function isFixtureBeforeCut(fixture: Fixture, now: Date = new Date()): boolean {
  if (fixture.kickoff === null) return false
  const kickoff = new Date(fixture.kickoff)
  if (isSameLocalDay(kickoff, now)) {
    return fixture.status === 'finished' || fixture.status === 'cancelled'
  }
  return kickoff.getTime() < now.getTime()
}

/** Orden cronológico ascendente; los partidos sin hora (`tbd`) van al final. */
export function sortFixturesChronologically(fixtures: Fixture[]): Fixture[] {
  return [...fixtures].sort((a, b) => {
    if (a.kickoff === null && b.kickoff === null) return 0
    if (a.kickoff === null) return 1
    if (b.kickoff === null) return -1
    return new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime()
  })
}

/**
 * Índice donde insertar la banda `PRÓXIMOS`, sobre una lista YA ordenada
 * cronológicamente (`sortFixturesChronologically`). `null` cuando no hay corte
 * que mostrar: todo ya jugado, o todo por jugar (§ 7.6 — "aparece una sola vez
 * por lista", nunca al principio ni al final sin separar nada).
 */
export function findProximosCutIndex(
  sortedFixtures: Fixture[],
  now: Date = new Date(),
): number | null {
  const index = sortedFixtures.findIndex((fixture) => !isFixtureBeforeCut(fixture, now))
  if (index <= 0 || index >= sortedFixtures.length) return null
  return index
}
