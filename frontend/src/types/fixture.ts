/**
 * Tipos de dominio, espejo de docs/data-model.md.
 *
 * docs/data-model.md deja los campos exactos y los estados reales de partido como
 * "PENDIENTE — relevamiento técnico" de la API real. Mientras tanto, `FixtureStatus`
 * modela los 8 estados provisionales de docs/design.md § 7.2 con claves internas en
 * inglés (no son copy): el mapeo a la etiqueta visible en español vive en el
 * componente de presentación (MatchRow), nunca acá. Cuando el relevamiento cierre,
 * este archivo es el que se ajusta.
 */

/** Los 8 estados de partido de docs/design.md § 7.2 (vocabulario provisional). */
export type FixtureStatus =
  | 'scheduled' // Programado
  | 'live' // En vivo
  | 'halftime' // Entretiempo
  | 'finished' // Finalizado
  | 'postponed' // Postergado
  | 'suspended' // Suspendido
  | 'cancelled' // Cancelado
  | 'tbd' // A confirmar (hora sin definir)

export interface Competition {
  id: string
  /** Nombre completo, ej. "Primera A — Argentina". Usado como título de pantalla. */
  name: string
  /** Forma corta cerrada en docs/design.md § 7.3, ej. "Primera A" (capitalizada, no en mayúsculas). */
  shortName: string
}

export interface Team {
  id: string
  /**
   * Nombre tal cual lo entrega la fuente (RN-001). Puede traer un sufijo
   * desambiguador entre paréntesis, ej. "Central Córdoba (SdE)" (§ 7.5).
   */
  name: string
}

export interface Fixture {
  id: string
  competition: Competition
  homeTeam: Team
  awayTeam: Team
  /**
   * Instante de inicio en UTC (ISO 8601), o `null` cuando el estado es `tbd`
   * (hora todavía sin confirmar). Se formatea en la zona horaria del
   * dispositivo del usuario en la presentación (RN-005) — nunca acá.
   */
  kickoff: string | null
  status: FixtureStatus
  /** Minuto de juego, cuando la fuente lo da (en vivo / suspendido). */
  minute: number | null
  homeScore: number | null
  awayScore: number | null
}
