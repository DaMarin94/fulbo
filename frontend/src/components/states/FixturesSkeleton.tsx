/**
 * Fila de skeleton (docs/design.md § 6, § 10.1): dos líneas de 28px (una por
 * equipo, ancho variable para que no se lea como una grilla perfecta) + una
 * línea corta de estado. Sin escudo (variante 1, § 7.4) y sin marca.
 */
function SkeletonRow({ nameWidth = 'w-3/5' }: { nameWidth?: string }) {
  return (
    <div
      data-testid="skeleton-row"
      className="flex flex-col gap-2 border-b border-border py-2 last:border-b-0"
    >
      <div className="flex min-h-7 items-center gap-2">
        <div className={`h-4 rounded-sm bg-surface-2 ${nameWidth}`} />
        <div className="ml-auto h-5 w-6 rounded-sm bg-surface-2" />
      </div>
      <div className="flex min-h-7 items-center gap-2">
        <div className="h-4 w-2/5 rounded-sm bg-surface-2" />
        <div className="ml-auto h-5 w-6 rounded-sm bg-surface-2" />
      </div>
      <div className="h-3 w-16 rounded-sm bg-surface-2" />
    </div>
  )
}

/**
 * Grupo de skeleton, con titular y subtítulo de anchos distintos según cuál
 * de los dos ejes manda (docs/design.md § 10.1): "por torneo" tiene titular
 * ancho (nombre de competición) y subtítulo corto (hora); "por horario" es al
 * revés. Es la única diferencia entre las dos siluetas.
 */
function SkeletonGroup({
  titularWidth,
  subtituloWidth,
}: {
  titularWidth: string
  subtituloWidth: string
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className={`mb-2 h-6 rounded-sm bg-surface-2 ${titularWidth}`} />
      <div className={`mb-2 h-3 rounded-sm bg-surface-2 ${subtituloWidth}`} />
      <SkeletonRow />
      <SkeletonRow nameWidth="w-2/5" />
    </div>
  )
}

interface FixturesSkeletonProps {
  /** Solo pantallas sin agrupación conmutable (Competición, Equipo): cantidad de filas planas. */
  count?: number
  /**
   * Solo Inicio (RF-008, § 10.1): el skeleton se bifurca según la vista activa
   * — dos siluetas distintas para anticipar la estructura correcta y que no
   * salte el layout al llegar el dato. Sin `view`, es la silueta genérica
   * (lista plana) de Competición y Equipo, que no tienen vista conmutable.
   */
  view?: 'byCompetition' | 'byTime'
}

export function FixturesSkeleton({ count = 5, view }: FixturesSkeletonProps) {
  if (view === 'byCompetition') {
    return (
      <div role="status" aria-label="Cargando partidos">
        <SkeletonGroup titularWidth="w-2/5" subtituloWidth="w-16" />
        <SkeletonGroup titularWidth="w-1/3" subtituloWidth="w-16" />
      </div>
    )
  }

  if (view === 'byTime') {
    return (
      <div role="status" aria-label="Cargando partidos">
        <SkeletonGroup titularWidth="w-16" subtituloWidth="w-2/5" />
        <SkeletonGroup titularWidth="w-16" subtituloWidth="w-1/3" />
      </div>
    )
  }

  return (
    <div role="status" aria-label="Cargando partidos">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonRow key={index} />
      ))}
    </div>
  )
}
