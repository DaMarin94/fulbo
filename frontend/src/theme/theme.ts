/**
 * Lógica de tema (RF-007, docs/design.md § 3.6). Pura y sin dependencias de React,
 * para poder testearla directo.
 *
 * IMPORTANTE: `THEME_STORAGE_KEY` tiene que coincidir siempre, literal, con la
 * clave hardcodeada en el script inline de `index.html` (el que resuelve el tema
 * antes del primer pintado). Si se cambia acá, hay que cambiarla ahí también.
 */

export const THEME_STORAGE_KEY = 'fulbo:theme-preference'

/** Las tres opciones de RF-007. "auto" es el default de fábrica (§ 3.6). */
export type ThemePreference = 'light' | 'dark' | 'auto'

/** El modo efectivamente pintado — nunca "auto": ya está resuelto. */
export type ThemeMode = 'light' | 'dark'

export const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'auto']

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'auto'
}

/**
 * Resuelve qué modo se pinta para una preferencia dada. "auto" sigue al sistema;
 * "light"/"dark" son fijos y no miran el sistema (§ 3.6).
 */
export function resolveThemeMode(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ThemeMode {
  if (preference === 'auto') {
    return systemPrefersDark ? 'dark' : 'light'
  }
  return preference
}
