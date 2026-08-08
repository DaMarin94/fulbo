import { formatKickoffTime } from '../lib/dateFormat'
import type { Fixture } from '../types/fixture'

/** Rótulo del subgrupo de partidos sin hora asignada (§ 7.2). */
export const TBD_LABEL = 'A confirmar'

/** Hora exacta del partido (titular/subtítulo, § 7.1), o `TBD_LABEL` sin `kickoff`. */
export function timeLabelFor(fixture: Fixture): string {
  return fixture.kickoff ? formatKickoffTime(fixture.kickoff) : TBD_LABEL
}

/**
 * Agrupa preservando el orden de primera aparición. Si se pasa `tbdKey`, ese
 * grupo (cuando existe) se manda al final: decisión del orquestador para la
 * ubicación del grupo "a confirmar" en la vista por horario de Inicio
 * (docs/design.md § 7.2 lo dejó como pendiente funcional), aplicada acá para
 * los dos ejes de agrupación de RF-008.
 */
export function groupPreservingOrder<T>(
  items: T[],
  keyFn: (item: T) => string,
  tbdKey?: string,
): Array<{ key: string; items: T[] }> {
  const order: string[] = []
  const byKey = new Map<string, T[]>()
  for (const item of items) {
    const key = keyFn(item)
    const existing = byKey.get(key)
    if (existing) existing.push(item)
    else {
      byKey.set(key, [item])
      order.push(key)
    }
  }
  const sortedKeys = tbdKey
    ? [...order].sort((a, b) => {
        if (a === tbdKey) return 1
        if (b === tbdKey) return -1
        return 0
      })
    : order
  return sortedKeys.map((key) => ({ key, items: byKey.get(key)! }))
}
