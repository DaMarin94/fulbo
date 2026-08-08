import { describe, expect, it } from 'vitest'
import {
  addDays,
  capitalize,
  formatAbsoluteDate,
  formatDayLabel,
  formatFullDateProse,
  formatKickoffTime,
  formatShortNumericDate,
  isSameLocalDay,
  parseLocalDateKey,
  startOfLocalDay,
  toLocalDateKey,
} from './dateFormat'

const TODAY = new Date(2026, 3, 18) // sábado 18 de abril de 2026 (mes 0-indexado)

describe('isSameLocalDay', () => {
  it('es true para la misma fecha con distinta hora', () => {
    expect(isSameLocalDay(new Date(2026, 3, 18, 3), new Date(2026, 3, 18, 23))).toBe(true)
  })

  it('es false para días distintos', () => {
    expect(isSameLocalDay(new Date(2026, 3, 18), new Date(2026, 3, 19))).toBe(false)
  })
})

describe('addDays', () => {
  it('suma y resta días, cruzando meses', () => {
    expect(toLocalDateKey(addDays(new Date(2026, 3, 30), 1))).toBe('2026-05-01')
    expect(toLocalDateKey(addDays(new Date(2026, 4, 1), -1))).toBe('2026-04-30')
  })

  it('no muta la fecha original', () => {
    const original = new Date(2026, 3, 18)
    addDays(original, 5)
    expect(original.getDate()).toBe(18)
  })
})

describe('toLocalDateKey / parseLocalDateKey', () => {
  it('formatea con ceros a la izquierda', () => {
    expect(toLocalDateKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('son inversas entre sí', () => {
    const key = '2026-04-18'
    expect(toLocalDateKey(parseLocalDateKey(key))).toBe(key)
  })
})

describe('startOfLocalDay', () => {
  it('pone la hora a medianoche', () => {
    const result = startOfLocalDay(new Date(2026, 3, 18, 23, 59))
    expect(result.getHours()).toBe(0)
    expect(result.getMinutes()).toBe(0)
  })
})

describe('formatAbsoluteDate', () => {
  it('sin año cuando coincide con el año de referencia', () => {
    expect(formatAbsoluteDate(new Date(2026, 3, 18), TODAY)).toBe('sáb 18 abr')
  })

  it('con año cuando difiere del año de referencia', () => {
    expect(formatAbsoluteDate(new Date(2027, 3, 18), TODAY)).toBe('dom 18 abr 2027')
  })
})

describe('formatDayLabel', () => {
  it('"Hoy" para el mismo día', () => {
    expect(formatDayLabel(TODAY, TODAY)).toBe('Hoy')
  })

  it('"Ayer" para el día anterior', () => {
    expect(formatDayLabel(addDays(TODAY, -1), TODAY)).toBe('Ayer')
  })

  it('"Mañana" para el día siguiente', () => {
    expect(formatDayLabel(addDays(TODAY, 1), TODAY)).toBe('Mañana')
  })

  it('fecha absoluta para cualquier otro día', () => {
    expect(formatDayLabel(addDays(TODAY, 10), TODAY)).toBe('mar 28 abr')
  })

  it('fecha absoluta con año al cruzar el año calendario', () => {
    expect(formatDayLabel(addDays(TODAY, 300), TODAY)).toBe('vie 12 feb 2027')
  })
})

describe('formatShortNumericDate', () => {
  it('formatea "dom 19/04"', () => {
    expect(formatShortNumericDate(new Date(2026, 3, 19))).toBe('dom 19/04')
  })

  it('rellena con ceros día y mes', () => {
    expect(formatShortNumericDate(new Date(2026, 0, 5))).toBe('lun 05/01')
  })
})

describe('formatFullDateProse', () => {
  it('sin año cuando coincide con la referencia', () => {
    expect(formatFullDateProse(TODAY, TODAY)).toBe('sábado 18 de abril')
  })

  it('con año cuando difiere', () => {
    expect(formatFullDateProse(new Date(2027, 3, 18), TODAY)).toBe('domingo 18 de abril de 2027')
  })
})

describe('formatKickoffTime', () => {
  it('devuelve "—" cuando no hay hora (a confirmar)', () => {
    expect(formatKickoffTime(null)).toBe('—')
  })

  it('formatea la hora en formato HH:mm de 24hs', () => {
    expect(formatKickoffTime('2026-08-07T18:00:00Z')).toMatch(/^\d{2}:\d{2}$/)
  })
})

describe('capitalize', () => {
  it('mayúscula la primera letra', () => {
    expect(capitalize('sábado 18 de abril')).toBe('Sábado 18 de abril')
  })

  it('no rompe con string vacío', () => {
    expect(capitalize('')).toBe('')
  })
})
