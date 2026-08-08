/**
 * Estado Cargando (docs/design.md § 6): skeleton, no spinner — 5 filas en
 * `--color-surface-2` con la misma altura mínima que la fila real (56px), para
 * que no salte el layout al llegar el dato. Sin escudo (variante 1, § 7.4) y
 * sin marca.
 */
export function FixturesSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div role="status" aria-label="Cargando partidos" className="divide-y divide-border">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex min-h-14 items-center gap-3 p-3">
          <div className="h-8 w-12 rounded-sm bg-surface-2" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="h-4 w-3/4 rounded-sm bg-surface-2" />
            <div className="h-4 w-1/2 rounded-sm bg-surface-2" />
          </div>
          <div className="h-8 w-6 rounded-sm bg-surface-2" />
        </div>
      ))}
    </div>
  )
}
