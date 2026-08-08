import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MatchRow } from './MatchRow'
import type { Fixture } from '../../types/fixture'
import { PRIMERA_A } from '../../data/mockFixtures'
import { formatKickoffTime, formatShortNumericDate } from '../../lib/dateFormat'

const HOME = { id: 'river-plate', name: 'River Plate' }
const AWAY = { id: 'central-cordoba-sde', name: 'Central Córdoba (SdE)' }
const KICKOFF = '2026-08-07T18:00:00Z'
// RN-005: la hora se muestra en la zona horaria del dispositivo. No se hardcodea
// el string esperado (dependería del TZ de quien corra los tests): se deriva con
// la misma función que usa el componente.
const KICKOFF_LOCAL_LABEL = formatKickoffTime(KICKOFF)
const KICKOFF_DATE_LABEL = formatShortNumericDate(new Date(KICKOFF))

function fixture(overrides: Partial<Fixture>): Fixture {
  return {
    id: 'f1',
    competition: PRIMERA_A,
    homeTeam: HOME,
    awayTeam: AWAY,
    kickoff: KICKOFF,
    status: 'scheduled',
    minute: null,
    homeScore: null,
    awayScore: null,
    ...overrides,
  }
}

function renderRow(f: Fixture, showMetaLine = false) {
  return render(
    <MemoryRouter>
      <MatchRow fixture={f} showMetaLine={showMetaLine} />
    </MemoryRouter>,
  )
}

describe('MatchRow', () => {
  it('renderiza las dos disposiciones (compacta y amplia) a la vez', () => {
    renderRow(fixture({ status: 'scheduled' }))
    expect(screen.getByTestId('match-row-compact')).toBeInTheDocument()
    expect(screen.getByTestId('match-row-wide')).toBeInTheDocument()
  })

  it('los nombres de equipo son links a /equipo/:id en ambas disposiciones', () => {
    renderRow(fixture({ status: 'scheduled' }))
    const compactLinks = within(screen.getByTestId('match-row-compact')).getAllByRole('link')
    const wideLinks = within(screen.getByTestId('match-row-wide')).getAllByRole('link')
    expect(compactLinks.map((l) => l.getAttribute('href'))).toEqual([
      '/equipo/river-plate',
      '/equipo/central-cordoba-sde',
    ])
    expect(wideLinks.map((l) => l.getAttribute('href'))).toEqual([
      '/equipo/river-plate',
      '/equipo/central-cordoba-sde',
    ])
  })

  it('un partido programado no muestra marcador (ni "-" ni "0-0") y no tiene fila de estado', () => {
    renderRow(fixture({ status: 'scheduled' }))
    const compact = screen.getByTestId('match-row-compact')
    const wide = screen.getByTestId('match-row-wide')
    expect(within(compact).queryByText('0')).not.toBeInTheDocument()
    expect(within(compact).queryByText('-')).not.toBeInTheDocument()
    // La hora no vive en el bloque (§ 7.0): programado tampoco muestra ningún estado.
    ;['Finalizado', 'En vivo', 'Entretiempo', 'Postergado', 'Suspendido', 'Cancelado', 'A confirmar'].forEach(
      (label) => expect(screen.queryByText(label)).not.toBeInTheDocument(),
    )
    expect(within(wide).getByText('–')).toBeInTheDocument()
  })

  it('un partido en vivo muestra "En vivo · <minuto>\'" igual en las dos disposiciones', () => {
    renderRow(fixture({ status: 'live', minute: 68, homeScore: 1, awayScore: 0 }))
    expect(screen.getAllByText("En vivo · 68'")).toHaveLength(2)
  })

  it('entretiempo nunca lleva minuto', () => {
    renderRow(fixture({ status: 'halftime', minute: 45, homeScore: 0, awayScore: 0 }))
    expect(screen.getAllByText('Entretiempo')).toHaveLength(2)
    expect(screen.queryByText(/45/)).not.toBeInTheDocument()
  })

  it('un partido finalizado muestra "Finalizado" (nunca "FIN")', () => {
    renderRow(fixture({ status: 'finished', homeScore: 2, awayScore: 1 }))
    expect(screen.getAllByText('Finalizado')).toHaveLength(2)
    expect(screen.queryByText('FIN')).not.toBeInTheDocument()
  })

  it.each([
    ['postponed', 'Postergado'],
    ['suspended', 'Suspendido'],
    ['cancelled', 'Cancelado'],
    ['tbd', 'A confirmar'],
  ] as const)('estado %s muestra la etiqueta capitalizada "%s" en las dos disposiciones', (status, label) => {
    renderRow(fixture({ status }))
    expect(screen.getAllByText(label)).toHaveLength(2)
  })

  it('el nombre completo queda en el atributo title, aunque se trunque visualmente', () => {
    renderRow(fixture({ status: 'scheduled' }))
    const links = screen.getAllByTitle('Central Córdoba (SdE)')
    expect(links.length).toBeGreaterThan(0)
  })

  describe('disposición amplia (§ 8.4)', () => {
    it('el marcador usa en dash (U+2013), no guion corto ni em dash', () => {
      renderRow(fixture({ status: 'finished', homeScore: 1, awayScore: 0 }))
      const wide = screen.getByTestId('match-row-wide')
      expect(within(wide).getByText('–')).toBeInTheDocument()
      expect(within(wide).queryByText('-')).not.toBeInTheDocument()
      expect(within(wide).queryByText('—')).not.toBeInTheDocument()
    })

    it('sin meta-línea, no muestra el nombre de la competición (Inicio y Competición)', () => {
      renderRow(fixture({ status: 'scheduled' }))
      expect(screen.queryByText('Primera A')).not.toBeInTheDocument()
    })

    it('con meta-línea (Equipo), muestra fecha + hora + competición como link, centrada', () => {
      renderRow(fixture({ status: 'scheduled' }), true)
      const wide = screen.getByTestId('match-row-wide')
      expect(within(wide).getByText(KICKOFF_DATE_LABEL)).toBeInTheDocument()
      expect(within(wide).getByText(KICKOFF_LOCAL_LABEL)).toBeInTheDocument()
      const competitionLink = within(wide).getByRole('link', { name: 'Primera A' })
      expect(competitionLink).toHaveAttribute('href', '/competicion/primera-a')
    })

    it('con meta-línea también en compacta', () => {
      renderRow(fixture({ status: 'scheduled' }), true)
      const compact = screen.getByTestId('match-row-compact')
      expect(within(compact).getByText(KICKOFF_DATE_LABEL)).toBeInTheDocument()
      expect(within(compact).getByRole('link', { name: 'Primera A' })).toHaveAttribute(
        'href',
        '/competicion/primera-a',
      )
    })
  })
})
