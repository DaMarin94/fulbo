import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { FixturesSkeleton } from './FixturesSkeleton'

describe('FixturesSkeleton', () => {
  it('renderiza 5 filas por default, con role="status"', () => {
    const { container } = render(<FixturesSkeleton />)
    expect(screen.getByRole('status', { name: 'Cargando partidos' })).toBeInTheDocument()
    expect(container.querySelectorAll('[class*="min-h-14"]')).toHaveLength(5)
  })

  it('acepta una cantidad de filas custom', () => {
    const { container } = render(<FixturesSkeleton count={3} />)
    expect(container.querySelectorAll('[class*="min-h-14"]')).toHaveLength(3)
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
