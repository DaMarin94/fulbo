import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { DrillDownHeader } from './DrillDownHeader'

describe('DrillDownHeader', () => {
  it('muestra el título y un link "Volver" al destino indicado', () => {
    render(
      <MemoryRouter>
        <DrillDownHeader title="Configuración" backTo="/" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Configuración' })).toBeInTheDocument()
    const back = screen.getByRole('link', { name: 'Volver' })
    expect(back).toHaveAttribute('href', '/')
  })

  it('trunca un título largo sin romper el link de volver (title completo en el atributo)', () => {
    const longTitle = 'Un nombre de competición extremadamente largo que debería truncarse'
    render(
      <MemoryRouter>
        <DrillDownHeader title={longTitle} backTo="/" />
      </MemoryRouter>,
    )
    const heading = screen.getByRole('heading', { name: longTitle })
    expect(heading).toHaveAttribute('title', longTitle)
  })
})
