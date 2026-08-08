import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { installMatchMediaMock } from '../test/mockMatchMedia'
import { ThemeProvider, useTheme } from './ThemeProvider'
import { THEME_STORAGE_KEY } from './theme'

function Probe() {
  const { preference, resolvedMode, setPreference } = useTheme()
  return (
    <div>
      <span data-testid="preference">{preference}</span>
      <span data-testid="resolved">{resolvedMode}</span>
      <button onClick={() => setPreference('light')}>light</button>
      <button onClick={() => setPreference('dark')}>dark</button>
      <button onClick={() => setPreference('auto')}>auto</button>
    </div>
  )
}

function renderProbe() {
  return render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  )
}

describe('ThemeProvider', () => {
  it('default de fábrica es "auto", resuelto contra el sistema (claro)', () => {
    installMatchMediaMock(false)
    renderProbe()
    expect(screen.getByTestId('preference')).toHaveTextContent('auto')
    expect(screen.getByTestId('resolved')).toHaveTextContent('light')
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })

  it('default "auto" resuelve a oscuro si el sistema está en oscuro', () => {
    installMatchMediaMock(true)
    renderProbe()
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('elegir Claro persiste y deja de escuchar al sistema', async () => {
    const user = userEvent.setup()
    const { setSystemPrefersDark } = installMatchMediaMock(false)
    renderProbe()

    await user.click(screen.getByRole('button', { name: 'light' }))
    expect(screen.getByTestId('preference')).toHaveTextContent('light')
    expect(screen.getByTestId('resolved')).toHaveTextContent('light')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')

    // El sistema pasa a oscuro: con "Claro" elegido, la app no se mueve.
    act(() => setSystemPrefersDark(true))
    expect(screen.getByTestId('resolved')).toHaveTextContent('light')
  })

  it('elegir Oscuro aplica data-theme="dark" y persiste', async () => {
    const user = userEvent.setup()
    installMatchMediaMock(false)
    renderProbe()

    await user.click(screen.getByRole('button', { name: 'dark' }))
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
  })

  it('con "auto" elegido, la app acompaña al sistema en vivo sin recargar', async () => {
    const { setSystemPrefersDark } = installMatchMediaMock(false)
    renderProbe()

    expect(screen.getByTestId('resolved')).toHaveTextContent('light')
    act(() => setSystemPrefersDark(true))
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
    expect(screen.getByTestId('preference')).toHaveTextContent('auto')
  })

  it('volver a "Auto" resincroniza al instante con el sistema', async () => {
    const user = userEvent.setup()
    const { setSystemPrefersDark } = installMatchMediaMock(true)
    renderProbe()

    await user.click(screen.getByRole('button', { name: 'light' }))
    expect(screen.getByTestId('resolved')).toHaveTextContent('light')

    await user.click(screen.getByRole('button', { name: 'auto' }))
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')

    act(() => setSystemPrefersDark(false))
    expect(screen.getByTestId('resolved')).toHaveTextContent('light')
  })

  it('lee la preferencia persistida al montar (simula recarga)', () => {
    installMatchMediaMock(false)
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    renderProbe()
    expect(screen.getByTestId('preference')).toHaveTextContent('dark')
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark')
  })

  it('ignora un valor corrupto en storage y cae al default "auto"', () => {
    installMatchMediaMock(false)
    window.localStorage.setItem(THEME_STORAGE_KEY, 'sepia')
    renderProbe()
    expect(screen.getByTestId('preference')).toHaveTextContent('auto')
  })
})
