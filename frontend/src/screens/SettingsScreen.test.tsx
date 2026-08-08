import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SettingsScreen } from './SettingsScreen'
import { installMatchMediaMock } from '../test/mockMatchMedia'
import { ThemeProvider } from '../theme/ThemeProvider'

function renderScreen() {
  installMatchMediaMock(false)
  return render(
    <ThemeProvider>
      <MemoryRouter>
        <SettingsScreen />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

describe('SettingsScreen', () => {
  it('tiene el header con volver atrás y el título "Configuración"', () => {
    renderScreen()
    expect(screen.getByRole('heading', { name: 'Configuración' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/')
  })

  it('muestra el control de tema con "Auto" seleccionado por default', () => {
    renderScreen()
    expect(screen.getByRole('radiogroup', { name: 'Tema' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Automático' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('muestra la línea de ayuda estática', () => {
    renderScreen()
    expect(screen.getByText('«Automático» usa el tema de tu sistema.')).toBeInTheDocument()
  })

  it('no tiene botón de guardar ni sección de acerca de', () => {
    renderScreen()
    expect(screen.queryByRole('button', { name: /guardar/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/acerca de/i)).not.toBeInTheDocument()
  })
})
