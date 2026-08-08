/**
 * Preferencia de vista de Inicio (RF-008, docs/design.md § 6.5). Pura y sin
 * dependencias de React, para poder testearla directo — mismo patrón que
 * `src/theme/theme.ts`.
 */

export const VIEW_STORAGE_KEY = 'fulbo:home-view-preference'

/** Las dos vistas conmutables de Inicio. "byCompetition" (por torneo) es el default (RF-008). */
export type ViewPreference = 'byCompetition' | 'byTime'

export const DEFAULT_VIEW: ViewPreference = 'byCompetition'

export function isViewPreference(value: unknown): value is ViewPreference {
  return value === 'byCompetition' || value === 'byTime'
}
