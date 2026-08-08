import { ChevronIcon } from './icons/ChevronIcon'
import { capitalize, formatDayLabel, formatFullDateProse, toLocalDateKey } from '../lib/dateFormat'

interface DayNavigatorProps {
  date: Date
  onPrevDay: () => void
  onNextDay: () => void
}

const RELATIVE_LABELS = new Set(['Hoy', 'Ayer', 'Mañana'])

/**
 * Navegador de día de Inicio (docs/design.md § 6.2): flechas ancladas a los
 * bordes + etiqueta centrada. Sticky (§ 9.2), con sombra solo en modo claro
 * (token `--shadow-1`, ya resuelto a `none` en oscuro — § 3.5).
 */
export function DayNavigator({ date, onPrevDay, onNextDay }: DayNavigatorProps) {
  const today = new Date()
  const relativeLabel = formatDayLabel(date, today)
  const isRelative = RELATIVE_LABELS.has(relativeLabel)
  const fullDateProse = formatFullDateProse(date, today)
  const accessibleName = isRelative
    ? `${relativeLabel}, ${fullDateProse}`
    : capitalize(fullDateProse)

  return (
    <div className="sticky top-0 z-10 border-b border-border bg-surface shadow-1">
      <div className="mx-auto flex h-14 max-w-[720px] items-center px-2">
        <button
          type="button"
          aria-label="Día anterior"
          onClick={onPrevDay}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-0 text-text-1 hover:bg-surface-2 active:bg-surface-2 active:text-brand-strong"
        >
          <ChevronIcon direction="left" className="h-5 w-5" />
        </button>
        <time
          dateTime={toLocalDateKey(date)}
          title={accessibleName}
          aria-label={accessibleName}
          className="tnum min-w-0 flex-1 shrink truncate text-center text-xl font-bold text-text-1"
        >
          {relativeLabel}
        </time>
        <button
          type="button"
          aria-label="Día siguiente"
          onClick={onNextDay}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-0 text-text-1 hover:bg-surface-2 active:bg-surface-2 active:text-brand-strong"
        >
          <ChevronIcon direction="right" className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
