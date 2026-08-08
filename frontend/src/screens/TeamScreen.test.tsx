import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { TeamScreen } from './TeamScreen'
import { MOCK_EMPTY_TEAM_ID, MOCK_ERROR_TEAM_ID } from '../data/mockFixtures'

function renderAt(teamId: string) {
  return render(
    <MemoryRouter initialEntries={[`/equipo/${teamId}`]}>
      <Routes>
        <Route path="/equipo/:teamId" element={<TeamScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TeamScreen', () => {
  it('el header muestra el nombre del equipo y "volver" a "/"', async () => {
    renderAt('river-plate')
    expect(await screen.findByRole('heading', { name: 'River Plate' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/')
  })

  it('muestra el skeleton mientras carga', () => {
    renderAt('river-plate')
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
  })

  it('lista plana: sin encabezados de grupo por fecha', async () => {
    renderAt('river-plate')
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(
      screen.queryByText(
        /^(dom|lun|mar|mié|jue|vie|sáb) \d+ (ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)/,
      ),
    ).not.toBeInTheDocument()
  })

  it('cada fila trae su meta-línea con la competición como link', async () => {
    renderAt('river-plate')
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getAllByRole('link', { name: 'PRIMERA A' }).length).toBeGreaterThan(0)
  })

  it('el equipo favorito no lleva ningún resaltado especial (RF-005)', async () => {
    renderAt('river-plate')
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.queryByText('★')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/favorito/i)).not.toBeInTheDocument()
  })

  it('estado Vacío: "No hay partidos para este equipo"', async () => {
    renderAt(MOCK_EMPTY_TEAM_ID)
    expect(await screen.findByText('No hay partidos para este equipo')).toBeInTheDocument()
  })

  it('estado Error: tarjeta con Reintentar', async () => {
    const user = userEvent.setup()
    renderAt(MOCK_ERROR_TEAM_ID)
    expect(await screen.findByText('No pudimos cargar los partidos')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
  })
})
