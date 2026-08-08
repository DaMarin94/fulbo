import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DayNavigator } from './DayNavigator'
import { addDays } from '../lib/dateFormat'

describe('DayNavigator', () => {
  it('muestra "Hoy" para la fecha de hoy', () => {
    render(<DayNavigator date={new Date()} onPrevDay={() => {}} onNextDay={() => {}} />)
    expect(screen.getByText('Hoy')).toBeInTheDocument()
  })

  it('muestra "Ayer" y "Mañana" para los días adyacentes', () => {
    const { rerender } = render(
      <DayNavigator date={addDays(new Date(), -1)} onPrevDay={() => {}} onNextDay={() => {}} />,
    )
    expect(screen.getByText('Ayer')).toBeInTheDocument()

    rerender(
      <DayNavigator date={addDays(new Date(), 1)} onPrevDay={() => {}} onNextDay={() => {}} />,
    )
    expect(screen.getByText('Mañana')).toBeInTheDocument()
  })

  it('muestra fecha absoluta para cualquier otro día', () => {
    render(
      <DayNavigator date={addDays(new Date(), 20)} onPrevDay={() => {}} onNextDay={() => {}} />,
    )
    // No debe decir Hoy/Ayer/Mañana.
    expect(screen.queryByText('Hoy')).not.toBeInTheDocument()
    expect(screen.queryByText('Ayer')).not.toBeInTheDocument()
    expect(screen.queryByText('Mañana')).not.toBeInTheDocument()
  })

  it('las flechas llaman a onPrevDay / onNextDay y tienen 44x44 con aria-label', async () => {
    const user = userEvent.setup()
    const onPrevDay = vi.fn()
    const onNextDay = vi.fn()
    render(<DayNavigator date={new Date()} onPrevDay={onPrevDay} onNextDay={onNextDay} />)

    const prev = screen.getByRole('button', { name: 'Día anterior' })
    const next = screen.getByRole('button', { name: 'Día siguiente' })
    expect(prev).toHaveClass('h-11', 'w-11')
    expect(next).toHaveClass('h-11', 'w-11')

    await user.click(prev)
    expect(onPrevDay).toHaveBeenCalledTimes(1)
    await user.click(next)
    expect(onNextDay).toHaveBeenCalledTimes(1)
  })

  it('no existe ningún botón "volver a hoy"', () => {
    render(<DayNavigator date={addDays(new Date(), 5)} onPrevDay={() => {}} onNextDay={() => {}} />)
    expect(screen.queryByRole('button', { name: /hoy/i })).not.toBeInTheDocument()
  })

  it('el elemento <time> lleva dateTime y un nombre accesible con la fecha completa', () => {
    render(<DayNavigator date={new Date()} onPrevDay={() => {}} onNextDay={() => {}} />)
    const time = screen.getByText('Hoy')
    expect(time.tagName).toBe('TIME')
    expect(time).toHaveAttribute('dateTime')
    expect(time.getAttribute('aria-label')).toMatch(/^Hoy, /)
  })
})
