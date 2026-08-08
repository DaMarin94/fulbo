import { DrillDownHeader } from '../components/DrillDownHeader'
import { ThemeControl } from '../components/ThemeControl'

/**
 * Pantalla Configuración (RF-007, docs/screens.md, docs/design.md § 10.4). Única
 * preferencia: el tema. Sin botón guardar (se aplica al instante), sin sección
 * "acerca de". Se accede solo desde Inicio.
 */
export function SettingsScreen() {
  return (
    <div>
      <DrillDownHeader title="Configuración" backTo="/" />
      <div className="px-4 pt-3 pb-6">
        <div className="rounded-md border border-border bg-surface p-4">
          <span className="mb-2 block text-sm font-medium text-text-2">Tema</span>
          <ThemeControl />
          <p className="mt-2 text-sm text-text-2">«Automático» usa el tema de tu sistema.</p>
        </div>
      </div>
    </div>
  )
}
