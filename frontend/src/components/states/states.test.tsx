import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { FixturesSkeleton } from './FixturesSkeleton'

describe('FixturesSkeleton', () => {
  it('renderiza 5 filas planas por default, con role="status"', () => {
    render(<FixturesSkeleton />)
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
    expect(screen.getAllByTestId('skeleton-row')).toHaveLength(5)
  })

  it('acepta una cantidad de filas custom', () => {
    render(<FixturesSkeleton count={3} />)
    expect(screen.getAllByTestId('skeleton-row')).toHaveLength(3)
  })

  it('vista "por torneo" (Inicio): silueta de dos grupos con titular ancho', () => {
    render(<FixturesSkeleton view="byCompetition" />)
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
    expect(screen.getAllByTestId('skeleton-row')).toHaveLength(4)
  })

  it('vista "por horario" (Inicio): silueta distinta de "por torneo"', () => {
    const { container: byCompetition } = render(<FixturesSkeleton view="byCompetition" />)
    const { container: byTime } = render(<FixturesSkeleton view="byTime" />)
    expect(byCompetition.innerHTML).not.toBe(byTime.innerHTML)
  })
})

describe('EmptyState', () => {
  it('muestra el mensaje recibido', () => {
    render(<EmptyState message="No hay partidos este día" />)
    expect(screen.getByText('No hay partidos este día')).toBeInTheDocument()
  })
})

describe('ErrorState', () => {
  it('muestra el copy cerrado de design.md § 6 y un botón Reintentar', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorState onRetry={onRetry} />)
    expect(screen.getByText('No pudimos cargar los partidos')).toBeInTheDocument()
    expect(screen.getByText('Revisá tu conexión y volvé a intentar.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
