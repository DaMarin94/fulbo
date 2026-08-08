/**
 * Utilidades de fecha, en la zona horaria del dispositivo del usuario (RN-005):
 * todo acá opera sobre los getters/setters *locales* de `Date` (nunca los UTC),
 * a propósito. `now`/`today` son siempre parámetros con default `new Date()`,
 * nunca hardcodeados adentro: así el código de producción usa el reloj real y
 * los tests pueden fijar una fecha de referencia sin volverse frágiles con el
 * paso del tiempo.
 */

const WEEKDAY_ABBR = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTH_ABBR = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
]
const WEEKDAY_FULL = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MONTH_FULL = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Nueva fecha desplazada `delta` días locales (acepta negativos). No muta `date`. */
export function addDays(date: Date, delta: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + delta)
  return next
}

/** Medianoche local del día de `date`. No muta `date`. */
export function startOfLocalDay(date: Date): Date {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

/** Clave de fecha local `YYYY-MM-DD` — la que consultan `getFixturesByDate` y RN-005. */
export function toLocalDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/** Inversa de `toLocalDateKey`: construye la fecha a medianoche local. */
export function parseLocalDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

/**
 * Fecha absoluta corta con nombre de mes (docs/design.md § 6.2 / § 10.2):
 * "sáb 18 abr", con el año agregado solo cuando `date` no cae en el año de
 * `today` — "el año aparece solo cuando cambia el año".
 */
export function formatAbsoluteDate(date: Date, today: Date = new Date()): string {
  const weekday = WEEKDAY_ABBR[date.getDay()]
  const month = MONTH_ABBR[date.getMonth()]
  const year = date.getFullYear() !== today.getFullYear() ? ` ${date.getFullYear()}` : ''
  return `${weekday} ${date.getDate()} ${month}${year}`
}

/**
 * Etiqueta del navegador de día de Inicio (§ 6.2): relativa en los tres días
 * cercanos, absoluta en el resto.
 */
export function formatDayLabel(date: Date, today: Date = new Date()): string {
  if (isSameLocalDay(date, today)) return 'Hoy'
  if (isSameLocalDay(date, addDays(today, -1))) return 'Ayer'
  if (isSameLocalDay(date, addDays(today, 1))) return 'Mañana'
  return formatAbsoluteDate(date, today)
}

/** Fecha numérica corta de la meta-línea de Equipo (§ 10.3): "dom 19/04". */
export function formatShortNumericDate(date: Date): string {
  return `${WEEKDAY_ABBR[date.getDay()]} ${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`
}

/**
 * Fecha completa en prosa, para el nombre accesible del navegador de día
 * (§ 6.2: «Hoy, sábado 18 de abril»). Mismo criterio de año que la forma corta.
 */
export function formatFullDateProse(date: Date, today: Date = new Date()): string {
  const weekday = WEEKDAY_FULL[date.getDay()]
  const month = MONTH_FULL[date.getMonth()]
  const year = date.getFullYear() !== today.getFullYear() ? ` de ${date.getFullYear()}` : ''
  return `${weekday} ${date.getDate()} de ${month}${year}`
}

export function capitalize(text: string): string {
  return text.length === 0 ? text : text[0].toUpperCase() + text.slice(1)
}
