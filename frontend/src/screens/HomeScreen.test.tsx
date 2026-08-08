import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { HomeScreen } from './HomeScreen'
import { MOCK_EMPTY_DATE, MOCK_ERROR_DATE } from '../data/mockFixtures'
import { parseLocalDateKey } from '../lib/dateFormat'
import { VIEW_STORAGE_KEY } from '../view/viewPreference'

afterEach(() => {
  window.localStorage.clear()
})

function renderHome(initialDate?: Date) {
  return render(
    <MemoryRouter>
      <HomeScreen initialDate={initialDate} />
    </MemoryRouter>,
  )
}

describe('HomeScreen', () => {
  it('muestra el wordmark, sin ser clickeable, con nombre accesible "Fulbo"', () => {
    renderHome()
    const heading = screen.getByRole('heading', { name: 'Fulbo' })
    expect(heading.tagName).toBe('H1')
    expect(screen.queryByRole('link', { name: 'Fulbo' })).not.toBeInTheDocument()
  })

  it('"Ajustes" es un ícono con nombre accesible "Ajustes", que linkea a Configuración', () => {
    renderHome()
    expect(screen.getByRole('link', { name: 'Ajustes' })).toHaveAttribute('href', '/configuracion')
  })

  it('resuelve "Mi equipo" al equipo favorito (RF-005)', async () => {
    renderHome()
    const link = await screen.findByRole('link', { name: 'Mi equipo' })
    expect(link.getAttribute('href')).toMatch(/^\/equipo\//)
  })

  it('muestra el skeleton mientras carga', () => {
    renderHome()
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
  })

  it('default: agrupa por torneo (RF-008), cada grupo con link a Competición', async () => {
    renderHome()
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'Primera A' })).toHaveAttribute(
      'href',
      '/competicion/primera-a',
    )
    expect(screen.getByRole('link', { name: 'Libertadores' })).toHaveAttribute(
      'href',
      '/competicion/libertadores',
    )
    expect(screen.getByRole('link', { name: 'Sudamericana' })).toHaveAttribute(
      'href',
      '/competicion/sudamericana',
    )
  })

  it('estado Vacío: "No hay partidos este día"', async () => {
    renderHome(parseLocalDateKey(MOCK_EMPTY_DATE))
    expect(await screen.findByText('No hay partidos este día')).toBeInTheDocument()
  })

  it('estado Error: tarjeta con Reintentar, que vuelve a Cargando', async () => {
    const user = userEvent.setup()
    renderHome(parseLocalDateKey(MOCK_ERROR_DATE))
    expect(await screen.findByText('No pudimos cargar los partidos')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
  })

  it('las flechas de día cambian la fecha y vuelven a pedir datos', async () => {
    const user = userEvent.setup()
    renderHome()
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Día siguiente' }))
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })

  it('un partido en vivo se ve dentro de su grupo, con la etiqueta "En vivo"', async () => {
    renderHome()
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    const primeraA = screen
      .getByRole('link', { name: 'Primera A' })
      .closest('[data-testid="home-group"]') as HTMLElement
    expect(within(primeraA).getAllByText(/^En vivo/).length).toBeGreaterThan(0)
  })

  describe('conmutador de vista (RF-008)', () => {
    it('muestra la píldora con la vista vigente ("Torneo" por default) y alterna al tocarla', async () => {
      const user = userEvent.setup()
      renderHome()
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

      const switcher = screen.getByRole('button', { name: /vista por torneo/i })
      expect(switcher).toHaveTextContent('Torneo')

      await user.click(switcher)
      expect(screen.getByRole('button', { name: /vista por horario/i })).toHaveTextContent(
        'Horario',
      )
      // Vista por horario: el titular pasa a ser la hora; "Primera A" sigue existiendo,
      // pero ahora como subtítulo (puede repetirse, uno por franja horaria).
      const primeraALinks = screen.getAllByRole('link', { name: 'Primera A' })
      expect(primeraALinks.length).toBeGreaterThan(0)
      primeraALinks.forEach((link) => expect(link).toHaveAttribute('href', '/competicion/primera-a'))
    })

    it('la vista elegida persiste en localStorage y sobrevive a un remount', async () => {
      const user = userEvent.setup()
      const { unmount } = renderHome()
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: /vista por torneo/i }))
      expect(window.localStorage.getItem(VIEW_STORAGE_KEY)).toBe('byTime')
      unmount()

      renderHome()
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
      expect(screen.getByRole('button', { name: /vista por horario/i })).toBeInTheDocument()
    })

    it('cambiar de vista y navegar de día mantiene la vista elegida', async () => {
      const user = userEvent.setup()
      renderHome()
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: /vista por torneo/i }))
      await user.click(screen.getByRole('button', { name: 'Día siguiente' }))
      await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())

      expect(screen.getByRole('button', { name: /vista por horario/i })).toBeInTheDocument()
    })
  })
})
