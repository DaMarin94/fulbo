import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

// jsdom no implementa matchMedia. Default neutro (sistema en claro, sin
// listeners activos); los tests que necesitan controlar el sistema
// (ThemeProvider, ThemeControl) lo reemplazan puntualmente con
// `src/test/mockMatchMedia.ts`.
function installDefaultMatchMedia() {
  window.matchMedia =
    window.matchMedia ||
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }))
}
installDefaultMatchMedia()

// jsdom no implementa scrollIntoView (usado para abrir Competición/Equipo
// posicionados en el corte PRÓXIMOS, § 7.6). Stub no-op para que no explote.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}

afterEach(() => {
  window.localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  installDefaultMatchMedia()
})
