import { vi } from 'vitest'

/**
 * Mock controlable de `window.matchMedia('(prefers-color-scheme: dark)')`, para
 * testear el seguimiento en vivo del sistema (docs/design.md § 3.6). Reemplaza
 * `window.matchMedia` completo: solo pensado para tests que consultan esa media
 * query específica.
 */
export function installMatchMediaMock(initialMatches: boolean) {
  let matches = initialMatches
  const listeners = new Set<(event: MediaQueryListEvent) => void>()

  const mql: MediaQueryList = {
    get matches() {
      return matches
    },
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (type: string, cb: EventListenerOrEventListenerObject) => {
      if (type === 'change') listeners.add(cb as (event: MediaQueryListEvent) => void)
    },
    removeEventListener: (type: string, cb: EventListenerOrEventListenerObject) => {
      if (type === 'change') listeners.delete(cb as (event: MediaQueryListEvent) => void)
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => true,
  }

  window.matchMedia = vi.fn().mockReturnValue(mql)

  function setSystemPrefersDark(value: boolean) {
    matches = value
    listeners.forEach((cb) => cb({ matches: value } as MediaQueryListEvent))
  }

  return { setSystemPrefersDark }
}
