import type { IconProps } from './types'

/**
 * Engranaje — acceso a Configuración desde Inicio (docs/design.md § 5, § 6.5).
 * 20px. Reemplaza a la palabra "Ajustes" en el encabezado de Inicio por
 * presupuesto de ancho (§ 6.5, § 10.1); el nombre accesible sigue siendo
 * "Ajustes", declarado por quien lo usa (el ícono nunca es el único portador
 * de significado).
 */
export function GearIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.02 5.98l-1.56 1.56M7.54 16.46l-1.56 1.56M18.02 18.02l-1.56-1.56M7.54 7.54 5.98 5.98" />
    </svg>
  )
}
