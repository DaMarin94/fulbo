/**
 * Corte entre lo jugado y lo que viene (docs/design.md § 7.6). Neutro, sin
 * marca; no es interactivo. Aparece una sola vez por lista, en Competición y
 * Equipo (nunca en Inicio).
 */
export function ProximosBanner() {
  return (
    <div className="border-y border-border bg-surface-2 px-3 py-1">
      <span className="text-xs font-semibold tracking-[0.04em] text-text-2 uppercase">
        PRÓXIMOS
      </span>
    </div>
  )
}
