import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ToastProvider } from './ToastProvider'
import { emitToast } from './toastBus'

describe('ToastProvider', () => {
  it('renderiza sus hijos normalmente', () => {
    render(
      <ToastProvider>
        <p>Contenido</p>
      </ToastProvider>,
    )
    expect(screen.getByText('Contenido')).toBeInTheDocument()
  })

  it('muestra un toast cuando se emite uno, con role="alert"', async () => {
    render(
      <ToastProvider>
        <p>Contenido</p>
      </ToastProvider>,
    )
    act(() => {
      emitToast({ tone: 'error', message: 'Algo salió mal' })
    })
    expect(await screen.findByRole('alert')).toHaveTextContent('Algo salió mal')
  })

  it('se puede cerrar manualmente con el botón "Cerrar"', async () => {
    const user = userEvent.setup()
    render(
      <ToastProvider>
        <p>Contenido</p>
      </ToastProvider>,
    )
    act(() => {
      emitToast({ tone: 'error', message: 'Algo salió mal' })
    })
    const alert = await screen.findByRole('alert')
    await user.click(screen.getByRole('button', { name: 'Cerrar' }))
    await waitFor(() => expect(alert).not.toBeInTheDocument())
  })

  it('se auto-descarta después de un tiempo', async () => {
    vi.useFakeTimers()
    render(
      <ToastProvider>
        <p>Contenido</p>
      </ToastProvider>,
    )
    act(() => {
      emitToast({ tone: 'error', message: 'Algo salió mal' })
    })
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(7000)
    })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('puede mostrar más de un toast a la vez', async () => {
    render(
      <ToastProvider>
        <p>Contenido</p>
      </ToastProvider>,
    )
    act(() => {
      emitToast({ tone: 'error', message: 'Primero' })
      emitToast({ tone: 'error', message: 'Segundo' })
    })
    expect(await screen.findAllByRole('alert')).toHaveLength(2)
  })
})
