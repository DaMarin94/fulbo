import { SwapIcon } from './icons/SwapIcon'
import type { ViewPreference } from '../view/viewPreference'

interface ViewSwitcherProps {
  view: ViewPreference
  onToggle: () => void
}

const LABEL: Record<ViewPreference, string> = {
  byCompetition: 'Torneo',
  byTime: 'Horario',
}

const CURRENT_PHRASE: Record<ViewPreference, string> = {
  byCompetition: 'por torneo',
  byTime: 'por horario',
}

const DESTINATION_PHRASE: Record<ViewPreference, string> = {
  byCompetition: 'por horario',
  byTime: 'por torneo',
}

/**
 * Conmutador de vista (RF-008, docs/design.md § 6.5): píldora de un toque que
 * muestra la vista vigente y alterna al tocarla — no es un segmentado de dos
 * opciones enfrentadas. El rótulo visible pierde la preposición (no entra a
 * 320px); vive entera en el `aria-label`, que nombra estado y destino.
 *
 * Área tocable de 44px lograda con un pseudo-elemento `::before` absoluto,
 * extendido 6px arriba y abajo, sin mover la caja visible de 32px ni el
 * layout (§ 6.5). El anillo de foco se dibuja sobre la caja visible (default
 * del navegador, sin `outline` en el pseudo-elemento).
 */
export function ViewSwitcher({ view, onToggle }: ViewSwitcherProps) {
  const ariaLabel = `Vista ${CURRENT_PHRASE[view]}. Tocar para cambiar a ${DESTINATION_PHRASE[view]}`

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      className="relative inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-border bg-surface-2 px-2 text-text-2 before:absolute before:inset-x-0 before:-top-1.5 before:-bottom-1.5 before:content-[''] hover:border-brand hover:text-text-1 active:border-brand-strong active:text-brand-strong"
    >
      <SwapIcon className="h-3.5 w-3.5 shrink-0" />
      <span className="text-xs font-semibold">{LABEL[view]}</span>
    </button>
  )
}
