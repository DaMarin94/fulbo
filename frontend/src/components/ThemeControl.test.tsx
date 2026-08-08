import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ThemeControl } from './ThemeControl'
import { installMatchMediaMock } from '../test/mockMatchMedia'
import { ThemeProvider } from '../theme/ThemeProvider'
import { THEME_STORAGE_KEY } from '../theme/theme'

function renderControl() {
  installMatchMediaMock(false)
  return render(
    <ThemeProvider>
      <ThemeControl />
    </ThemeProvider>,
  )
}

describe('ThemeControl', () => {
  it('es un radiogroup con tres radios: Claro, Oscuro, Automático', () => {
    renderControl()
    const group = screen.getByRole('radiogroup', { name: 'Tema' })
    expect(group).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Claro' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toBeInTheDocument()
    const auto = screen.getByRole('radio', { name: 'Automático' })
    expect(auto).toBeInTheDocument()
    // La palabra visible es "Auto", aunque el nombre accesible sea "Automático".
    expect(auto).toHaveTextContent('Auto')
  })

  it('siempre hay exactamente un segmento seleccionado: "Auto" por default', () => {
    renderControl()
    const radios = screen.getAllByRole('radio')
    const checked = radios.filter((radio) => radio.getAttribute('aria-checked') === 'true')
    expect(checked).toHaveLength(1)
    expect(screen.getByRole('radio', { name: 'Automático' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  it('clickear "Claro" lo selecciona y persiste, y solo queda uno seleccionado', async () => {
    const user = userEvent.setup()
    renderControl()

    await user.click(screen.getByRole('radio', { name: 'Claro' }))

    expect(screen.getByRole('radio', { name: 'Claro' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByRole('radio', { name: 'Automático' })).toHaveAttribute(
      'aria-checked',
      'false',
    )
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('roving tabindex: solo el seleccionado entra en el tab order', () => {
    renderControl()
    expect(screen.getByRole('radio', { name: 'Claro' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('radio', { name: 'Automático' })).toHaveAttribute('tabindex', '0')
  })

  it('las flechas → y ← recorren los tres segmentos, con envolvimiento', async () => {
    const user = userEvent.setup()
    renderControl()

    const claro = screen.getByRole('radio', { name: 'Claro' })
    claro.focus()
    expect(claro).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Oscuro' })).toHaveAttribute('aria-checked', 'true')

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Automático' })).toHaveFocus()

    // Envolvimiento: del último (Automático) al primero (Claro).
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: 'Claro' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: 'Claro' })).toHaveAttribute('aria-checked', 'true')

    // Envolvimiento hacia atrás: del primero al último.
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: 'Automático' })).toHaveFocus()
  })
})
