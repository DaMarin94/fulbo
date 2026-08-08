import type { Fixture } from '../../types/fixture'

export interface StatusBadgeInfo {
  shape: 'dot' | 'diamond' | null
  label: string
  colorClassName: string
  pulse: boolean
}

export interface ScoreCellInfo {
  value: number
  weightClassName: string
  colorClassName: string
}

export interface MatchRowPresentation {
  /**
   * Línea de estado del bloque (docs/design.md § 7.0, § 7.2) — un solo
   * vocabulario, capitalizado, en las dos disposiciones (compacta y amplia,
   * § 8.4) y en las tres pantallas. `null` para "Programado": el renglón se
   * reserva igual (invariante 3), pero no hay nada que decir.
   */
  statusLine: StatusBadgeInfo | null
  home: ScoreCellInfo | null
  away: ScoreCellInfo | null
}

function inProgressScoreCells(homeScore: number, awayScore: number) {
  const cell = (value: number): ScoreCellInfo => ({
    value,
    weightClassName: 'font-semibold',
    colorClassName: 'text-text-1',
  })
  return { home: cell(homeScore), away: cell(awayScore) }
}

function finishedScoreCells(homeScore: number, awayScore: number) {
  if (homeScore === awayScore) {
    const draw = (value: number): ScoreCellInfo => ({
      value,
      weightClassName: 'font-medium',
      colorClassName: 'text-text-1',
    })
    return { home: draw(homeScore), away: draw(awayScore) }
  }
  const homeWins = homeScore > awayScore
  const winner = (value: number): ScoreCellInfo => ({
    value,
    weightClassName: 'font-bold',
    colorClassName: 'text-text-1',
  })
  const loser = (value: number): ScoreCellInfo => ({
    value,
    weightClassName: 'font-normal',
    colorClassName: 'text-text-2',
  })
  return {
    home: homeWins ? winner(homeScore) : loser(homeScore),
    away: homeWins ? loser(awayScore) : winner(awayScore),
  }
}

/**
 * Deriva de un `Fixture` todo lo que `MatchRow` necesita para pintarse, según el
 * vocabulario provisional de docs/design.md § 7.2 (los 8 estados, capitalizado,
 * sin abreviaturas — `FIN` fue eliminado). La hora **no** vive acá: salió del
 * bloque (§ 7.0) y vive siempre en el envoltorio (titular/subtítulo/meta-línea),
 * fuera de este componente.
 */
export function getMatchRowPresentation(fixture: Fixture): MatchRowPresentation {
  switch (fixture.status) {
    case 'scheduled':
      return { statusLine: null, home: null, away: null }

    case 'live': {
      const scores =
        fixture.homeScore !== null && fixture.awayScore !== null
          ? inProgressScoreCells(fixture.homeScore, fixture.awayScore)
          : { home: null, away: null }
      const minuteSuffix = fixture.minute !== null ? ` · ${fixture.minute}'` : ''
      return {
        statusLine: {
          shape: 'dot',
          label: `En vivo${minuteSuffix}`,
          colorClassName: 'text-live',
          pulse: true,
        },
        ...scores,
      }
    }

    case 'halftime': {
      const scores =
        fixture.homeScore !== null && fixture.awayScore !== null
          ? inProgressScoreCells(fixture.homeScore, fixture.awayScore)
          : { home: null, away: null }
      return {
        // Entretiempo nunca lleva minuto (§ 7.2): el partido está detenido.
        statusLine: { shape: 'dot', label: 'Entretiempo', colorClassName: 'text-live', pulse: true },
        ...scores,
      }
    }

    case 'finished': {
      const scores =
        fixture.homeScore !== null && fixture.awayScore !== null
          ? finishedScoreCells(fixture.homeScore, fixture.awayScore)
          : { home: null, away: null }
      return {
        statusLine: {
          shape: null,
          label: 'Finalizado',
          colorClassName: 'text-text-3',
          pulse: false,
        },
        ...scores,
      }
    }

    case 'postponed':
      return {
        statusLine: { shape: 'diamond', label: 'Postergado', colorClassName: 'text-warn', pulse: false },
        home: null,
        away: null,
      }

    case 'suspended': {
      // § 7.2: "Puede haber parcial — se muestra tal cual". El vocabulario provisional
      // no cierra el peso tipográfico de un parcial suspendido (no es "en vivo" ni
      // "finalizado"): se trata como partido en curso (600 ambos, § 3.1) porque
      // todavía no hay un ganador que distinguir. Pendiente de confirmar con design
      // cuando el relevamiento real cierre § 7.2 (ver reporte de la etapa).
      const scores =
        fixture.homeScore !== null && fixture.awayScore !== null
          ? inProgressScoreCells(fixture.homeScore, fixture.awayScore)
          : { home: null, away: null }
      const label = fixture.minute !== null ? `Suspendido · ${fixture.minute}'` : 'Suspendido'
      return {
        statusLine: { shape: 'diamond', label, colorClassName: 'text-warn', pulse: false },
        ...scores,
      }
    }

    case 'cancelled':
      return {
        // Nunca rojo: un partido cancelado no es un error de la app (§ 3.1).
        statusLine: { shape: 'diamond', label: 'Cancelado', colorClassName: 'text-warn', pulse: false },
        home: null,
        away: null,
      }

    case 'tbd':
      return {
        // Neutro, sin forma: el partido está bien, lo que falta es la hora (§ 7.2).
        statusLine: {
          shape: null,
          label: 'A confirmar',
          colorClassName: 'text-text-3',
          pulse: false,
        },
        home: null,
        away: null,
      }
  }
}
