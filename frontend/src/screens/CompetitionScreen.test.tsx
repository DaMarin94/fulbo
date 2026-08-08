import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CompetitionScreen } from './CompetitionScreen'
import { MOCK_EMPTY_COMPETITION_ID, MOCK_ERROR_COMPETITION_ID } from '../data/mockFixtures'

function renderAt(competitionId: string) {
  return render(
    <MemoryRouter initialEntries={[`/competicion/${competitionId}`]}>
      <Routes>
        <Route path="/competicion/:competitionId" element={<CompetitionScreen />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CompetitionScreen', () => {
  it('el header muestra el nombre completo de la competición y "volver" a "/"', async () => {
    renderAt('primera-a')
    expect(
      await screen.findByRole('heading', { name: 'Primera A — Argentina' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver' })).toHaveAttribute('href', '/')
  })

  it('muestra el skeleton mientras carga', () => {
    renderAt('primera-a')
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
  })

  it('agrupa por fecha, con encabezados no clickeables', async () => {
    renderAt('primera-a')
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    // Ningún encabezado de fecha es un link (a diferencia del de Inicio).
    const dateHeadings = screen.getAllByText(/^(dom|lun|mar|mié|jue|vie|sáb) /)
    dateHeadings.forEach((heading) => {
      expect(heading.closest('a')).toBeNull()
    })
  })

  it('los nombres de equipo siguen siendo clickeables dentro de la lista', async () => {
    renderAt('primera-a')
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getAllByRole('link', { name: /river plate/i }).length).toBeGreaterThan(0)
  })

  it('estado Vacío: "No hay partidos para esta competición"', async () => {
    renderAt(MOCK_EMPTY_COMPETITION_ID)
    expect(await screen.findByText('No hay partidos para esta competición')).toBeInTheDocument()
  })

  it('estado Error: tarjeta con Reintentar', async () => {
    const user = userEvent.setup()
    renderAt(MOCK_ERROR_COMPETITION_ID)
    expect(await screen.findByText('No pudimos cargar los partidos')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
  })

  it('un título largo no se inventa: usa el nombre completo real de la competición', async () => {
    renderAt('libertadores')
    expect(await screen.findByRole('heading', { name: 'Copa Libertadores' })).toBeInTheDocument()
  })
})
