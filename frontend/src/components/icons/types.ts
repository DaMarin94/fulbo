import type { SVGProps } from 'react'

/**
 * Inventario de iconos cerrado (docs/design.md § 5): los tres glifos del control
 * de tema, el chevron de los botones de icono y el icono neutro del estado Vacío.
 * Todos con trazo (stroke) 1.5–2px, en `currentColor`, sin relleno salvo donde el
 * propio glifo lo pide (ContrastIcon). Ningún icono es portador único de
 * significado: siempre van con `aria-hidden` porque la palabra al lado desambigua.
 */
export type IconProps = SVGProps<SVGSVGElement>
