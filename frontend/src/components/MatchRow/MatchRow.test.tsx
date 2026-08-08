import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MatchRow } from './MatchRow'
import { formatKickoffTime } from './matchRowPresentation'
import type { Fixture } from '../../types/fixture'
import { PRIMERA_A } from '../../data/mockFixtures'

const HOME = { id: 'river-plate', name: 'River Plate' }
const AWAY = { id: 'central-cordoba-sde', name: 'Central Córdoba (SdE)' }
const KICKOFF = '2026-08-07T18:00:00Z'
// RN-005: la hora se muestra en la zona horaria del dispositivo. No se hardcodea
// el string esperado (dependería del TZ de quien corra los tests): se deriva con
// la misma función que usa el componente.
const KICKOFF_LOCAL_LABEL = formatKickoffTime(KICKOFF)

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

function renderRow(f: Fixture, metaLine?: { dateLabel: string }) {
  return render(
    <MemoryRouter>
      <MatchRow fixture={f} metaLine={metaLine} />
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
    // El eje amplio muestra la hora (§ 8.4) en vez del marcador.
    expect(within(wide).getByText(KICKOFF_LOCAL_LABEL)).toBeInTheDocument()
  })

  it('un partido en vivo muestra EN VIVO y el minuto (embebido en amplia, aparte en compacta)', () => {
    renderRow(fixture({ status: 'live', minute: 68, homeScore: 1, awayScore: 0 }))
    const compact = screen.getByTestId('match-row-compact')
    const wide = screen.getByTestId('match-row-wide')
    expect(within(compact).getByText('EN VIVO')).toBeInTheDocument()
    expect(within(compact).getByText("68'")).toBeInTheDocument()
    expect(within(wide).getByText("EN VIVO · 68'")).toBeInTheDocument()
  })

  it('un partido finalizado muestra FIN en compacta (sin franja) y en la fila 3 amplia', () => {
    renderRow(fixture({ status: 'finished', homeScore: 2, awayScore: 1 }))
    const compact = screen.getByTestId('match-row-compact')
    const wide = screen.getByTestId('match-row-wide')
    expect(within(compact).getByText('FIN')).toBeInTheDocument()
    expect(within(wide).getByText('FIN')).toBeInTheDocument()
    expect(screen.queryByText('FINALIZADO')).not.toBeInTheDocument()
  })

  it.each([
    ['postponed', 'POSTERGADO'],
    ['suspended', 'SUSPENDIDO'],
    ['cancelled', 'CANCELADO'],
    ['tbd', 'A CONFIRMAR'],
  ] as const)(
    'estado %s muestra la etiqueta completa "%s" en las dos disposiciones',
    (status, label) => {
      renderRow(fixture({ status }))
      expect(screen.getAllByText(label)).toHaveLength(2)
    },
  )

  it('a confirmar muestra "—" en la hora de la ranura compacta y del eje amplio', () => {
    renderRow(fixture({ status: 'tbd', kickoff: null }))
    expect(screen.getAllByText('—')).toHaveLength(2)
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

    it('la hora aparece en la fila de estado cuando el eje ya muestra el marcador', () => {
      renderRow(
        fixture({
          status: 'finished',
          homeScore: 1,
          awayScore: 0,
          kickoff: '2026-08-07T18:00:00Z',
        }),
      )
      const wide = screen.getByTestId('match-row-wide')
      expect(within(wide).getByText(KICKOFF_LOCAL_LABEL)).toBeInTheDocument()
      expect(within(wide).getByText('FIN')).toBeInTheDocument()
    })

    it('no repite la hora cuando el eje ya la mostró (programado)', () => {
      renderRow(fixture({ status: 'scheduled', kickoff: '2026-08-07T18:00:00Z' }))
      const wide = screen.getByTestId('match-row-wide')
      expect(within(wide).getAllByText(KICKOFF_LOCAL_LABEL)).toHaveLength(1)
    })

    it('sin meta-línea, sin fila 1 (Inicio y Competición)', () => {
      renderRow(fixture({ status: 'scheduled' }))
      expect(screen.queryByText('PRIMERA A')).not.toBeInTheDocument()
    })

    it('con meta-línea (Equipo), muestra fecha + competición como link, centrada', () => {
      renderRow(fixture({ status: 'scheduled' }), { dateLabel: 'dom 19/04' })
      const wide = screen.getByTestId('match-row-wide')
      expect(within(wide).getByText('dom 19/04')).toBeInTheDocument()
      const competitionLink = within(wide).getByRole('link', { name: 'PRIMERA A' })
      expect(competitionLink).toHaveAttribute('href', '/competicion/primera-a')
    })
  })
})
