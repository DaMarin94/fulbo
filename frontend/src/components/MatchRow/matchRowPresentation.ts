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

export interface SubLineInfo {
  text: string
  colorClassName: string
}

export interface MatchRowPresentation {
  timeLabel: string
  /** Color de la hora en la ranura de tiempo de la disposición compacta (§ 7.0). */
  timeColorClassName: string
  /** Col. 1 en compacta: qué momento del partido es (FIN / ENTR. / minuto). */
  subLine: SubLineInfo | null
  /** Franja de estado en compacta, debajo de los nombres (§ 7.0). */
  statusBadge: StatusBadgeInfo | null
  /**
   * "Estado en palabras" de la fila 3 en disposición amplia (§ 8.4). Existe para
   * los 8 estados salvo Programado (que no tiene nada que decir ahí). A
   * diferencia de `statusBadge`, existe también para Finalizado (con `FIN`, sin
   * forma) y el de En vivo incluye el minuto embebido en el propio texto — en
   * amplia no hay una sub-línea aparte donde ponerlo.
   */
  wideStatusWord: StatusBadgeInfo | null
  home: ScoreCellInfo | null
  away: ScoreCellInfo | null
}

/** RN-005 — la hora se muestra en la zona horaria del dispositivo del usuario. */
export function formatKickoffTime(kickoff: string | null): string {
  if (!kickoff) return '—'
  const date = new Date(kickoff)
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h23',
  }).format(date)
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
 * vocabulario provisional de docs/design.md § 7.2 (los 8 estados) y § 8.4 (fila
 * 3 de la disposición amplia). Separado del componente para poder testear la
 * lógica de estado sin renderizar nada.
 */
export function getMatchRowPresentation(fixture: Fixture): MatchRowPresentation {
  const timeLabel = formatKickoffTime(fixture.kickoff)

  switch (fixture.status) {
    case 'scheduled':
      return {
        timeLabel,
        timeColorClassName: 'text-text-2',
        subLine: null,
        statusBadge: null,
        wideStatusWord: null,
        home: null,
        away: null,
      }

    case 'live': {
      const scores =
        fixture.homeScore !== null && fixture.awayScore !== null
          ? inProgressScoreCells(fixture.homeScore, fixture.awayScore)
          : { home: null, away: null }
      const minuteSuffix = fixture.minute !== null ? ` · ${fixture.minute}'` : ''
      return {
        timeLabel,
        timeColorClassName: 'text-text-2',
        subLine:
          fixture.minute !== null
            ? { text: `${fixture.minute}'`, colorClassName: 'text-live' }
            : null,
        statusBadge: { shape: 'dot', label: 'EN VIVO', colorClassName: 'text-live', pulse: true },
        wideStatusWord: {
          shape: 'dot',
          label: `EN VIVO${minuteSuffix}`,
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
      const badge: StatusBadgeInfo = {
        shape: 'dot',
        label: 'ENTRETIEMPO',
        colorClassName: 'text-live',
        pulse: true,
      }
      return {
        timeLabel,
        timeColorClassName: 'text-text-2',
        subLine: { text: 'ENTR.', colorClassName: 'text-live' },
        statusBadge: badge,
        wideStatusWord: badge,
        ...scores,
      }
    }

    case 'finished': {
      const scores =
        fixture.homeScore !== null && fixture.awayScore !== null
          ? finishedScoreCells(fixture.homeScore, fixture.awayScore)
          : { home: null, away: null }
      return {
        timeLabel,
        timeColorClassName: 'text-text-2',
        subLine: { text: 'FIN', colorClassName: 'text-text-3' },
        // Sin franja en compacta (§ 7.2): el marcador ya dice que terminó.
        statusBadge: null,
        // En amplia SÍ hay una fila 3 con "FIN" — es la única forma de no
        // perder ese dato al no existir la sub-línea de la col. 1 (§ 8.4).
        wideStatusWord: { shape: null, label: 'FIN', colorClassName: 'text-text-3', pulse: false },
        ...scores,
      }
    }

    case 'postponed': {
      const badge: StatusBadgeInfo = {
        shape: 'diamond',
        label: 'POSTERGADO',
        colorClassName: 'text-warn',
        pulse: false,
      }
      return {
        timeLabel,
        timeColorClassName: 'text-text-2',
        subLine: null,
        statusBadge: badge,
        wideStatusWord: badge,
        home: null,
        away: null,
      }
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
      const label = fixture.minute !== null ? `SUSPENDIDO · ${fixture.minute}'` : 'SUSPENDIDO'
      const badge: StatusBadgeInfo = {
        shape: 'diamond',
        label,
        colorClassName: 'text-warn',
        pulse: false,
      }
      return {
        timeLabel,
        timeColorClassName: 'text-text-2',
        subLine: null,
        statusBadge: badge,
        wideStatusWord: badge,
        ...scores,
      }
    }

    case 'cancelled': {
      const badge: StatusBadgeInfo = {
        shape: 'diamond',
        label: 'CANCELADO',
        colorClassName: 'text-warn',
        pulse: false,
      }
      return {
        timeLabel,
        timeColorClassName: 'text-text-2',
        subLine: null,
        statusBadge: badge,
        wideStatusWord: badge,
        home: null,
        away: null,
      }
    }

    case 'tbd': {
      const badge: StatusBadgeInfo = {
        shape: null,
        label: 'A CONFIRMAR',
        colorClassName: 'text-text-2',
        pulse: false,
      }
      return {
        timeLabel: '—',
        timeColorClassName: 'text-text-3',
        subLine: null,
        statusBadge: badge,
        wideStatusWord: badge,
        home: null,
        away: null,
      }
    }
  }
}
