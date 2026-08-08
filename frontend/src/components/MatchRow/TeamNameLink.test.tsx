import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { splitTeamName, TeamNameLink } from './TeamNameLink'

describe('splitTeamName', () => {
  it('separa un sufijo desambiguador entre paréntesis', () => {
    expect(splitTeamName('Central Córdoba (SdE)')).toEqual({
      base: 'Central Córdoba',
      suffix: '(SdE)',
    })
  })

  it('no separa nada si no hay paréntesis', () => {
    expect(splitTeamName('River Plate')).toEqual({ base: 'River Plate', suffix: null })
  })

  it('no confunde paréntesis en medio del nombre con un sufijo final', () => {
    // El patrón exige que el paréntesis cierre el nombre (no hay texto después).
    expect(splitTeamName('Deportivo (Test) FC')).toEqual({
      base: 'Deportivo (Test) FC',
      suffix: null,
    })
  })
})

describe('TeamNameLink', () => {
  it('linkea a la pantalla de Equipo con el nombre completo en title', () => {
    render(
      <MemoryRouter>
        <TeamNameLink team={{ id: 'central-cordoba-sde', name: 'Central Córdoba (SdE)' }} />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: 'Central Córdoba (SdE)' })
    expect(link).toHaveAttribute('href', '/equipo/central-cordoba-sde')
    expect(link).toHaveAttribute('title', 'Central Córdoba (SdE)')
  })

  it('renderiza base y sufijo en spans separados para proteger el sufijo del truncado', () => {
    render(
      <MemoryRouter>
        <TeamNameLink team={{ id: 't', name: 'Gimnasia y Esgrima (LP)' }} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Gimnasia y Esgrima')).toBeInTheDocument()
    expect(screen.getByText('(LP)')).toBeInTheDocument()
  })
})
