import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'
import { installMatchMediaMock } from './test/mockMatchMedia'
import { ThemeProvider } from './theme/ThemeProvider'

function renderAt(path: string) {
  installMatchMediaMock(false)
  return render(
    <ThemeProvider>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('App routing', () => {
  it('"/" renderiza Inicio (wordmark + accesos)', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'Fulbo' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ajustes' })).toHaveAttribute('href', '/configuracion')
  })

  it('"/configuracion" renderiza la pantalla de Configuración', () => {
    renderAt('/configuracion')
    expect(screen.getByRole('heading', { name: 'Configuración' })).toBeInTheDocument()
  })

  it('"/competicion/:id" renderiza la pantalla de Competición', async () => {
    renderAt('/competicion/primera-a')
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Primera A — Argentina' })).toBeInTheDocument(),
    )
  })

  it('"/equipo/:id" renderiza la pantalla de Equipo', async () => {
    renderAt('/equipo/river-plate')
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'River Plate' })).toBeInTheDocument(),
    )
  })
})
