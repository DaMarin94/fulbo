import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { HomeScreen } from './HomeScreen'
import { MOCK_EMPTY_DATE, MOCK_ERROR_DATE } from '../data/mockFixtures'
import { parseLocalDateKey } from '../lib/dateFormat'

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

  it('muestra "Ajustes", que linkea a Configuración', () => {
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

  it('agrupa los partidos del día por competición, cada grupo con link a Competición', async () => {
    renderHome()
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'PRIMERA A' })).toHaveAttribute(
      'href',
      '/competicion/primera-a',
    )
    expect(screen.getByRole('link', { name: 'LIBERTADORES' })).toHaveAttribute(
      'href',
      '/competicion/libertadores',
    )
    expect(screen.getByRole('link', { name: 'SUDAMERICANA' })).toHaveAttribute(
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

  it('un partido en vivo se ve dentro de su grupo de competición', async () => {
    renderHome()
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    const primeraA = screen.getByRole('link', { name: 'PRIMERA A' }).closest('div')!
    expect(within(primeraA).getAllByText('EN VIVO').length).toBeGreaterThan(0)
  })
})
