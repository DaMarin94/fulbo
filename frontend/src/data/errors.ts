/**
 * Error de la capa de datos de fixtures. Hoy lo lanza el mock (ver
 * `mockFixtures.ts`); el día que exista el backend real, la capa central de HTTP
 * de `docs/technical.md` es la que decide cómo se mapea un error de red/response
 * a este mismo tipo (o lo reemplaza) — no es parte de esta etapa.
 */
export class FixturesFetchError extends Error {
  constructor(message = 'No se pudieron cargar los partidos.') {
    super(message)
    this.name = 'FixturesFetchError'
  }
}
