import { Link } from 'react-router-dom'
import { ChevronIcon } from './icons/ChevronIcon'

interface DrillDownHeaderProps {
  /** Título de la pantalla (nombre completo de competición/equipo, o "Configuración"). */
  title: string
  /**
   * Destino de "volver atrás". Es un `Link` a una ruta fija (no `history.back()`):
   * predecible incluso si se entró directo por URL — ver nota en el reporte de
   * la etapa. Configuración solo se llega desde Inicio (docs/screens.md), así
   * que ahí siempre es "/".
   */
  backTo: string
}

/**
 * Header compartido de las pantallas de drill-down (docs/design.md § 9, § 10.2):
 * botón "volver atrás" + título. Lo comparten Configuración, Competición y
 * Equipo. 56px, **fijo** al hacer scroll (§ 9.2, en las tres pantallas —en
 * Configuración por consistencia, aunque no scrollee); sangra a todo el ancho,
 * con el contenido interno topado a 720px. Sombra solo en claro (`--shadow-1`,
 * ya resuelto a `none` en oscuro).
 */
export function DrillDownHeader({ title, backTo }: DrillDownHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface shadow-1">
      <div className="mx-auto flex h-14 max-w-[720px] items-center gap-1 px-2">
        <Link
          to={backTo}
          aria-label="Volver"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-1 hover:bg-surface-2 active:bg-surface-2 active:text-brand-strong"
        >
          <ChevronIcon direction="left" className="h-5 w-5" />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-xl font-bold text-text-1" title={title}>
          {title}
        </h1>
      </div>
    </header>
  )
}
