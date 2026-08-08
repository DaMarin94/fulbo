import { useMemo } from 'react'
import { MatchMetaLine } from './MatchMetaLine'
import { getMatchRowPresentation } from './matchRowPresentation'
import { StatusBadge } from './StatusBadge'
import { TeamNameLink } from './TeamNameLink'
import type { Fixture } from '../../types/fixture'

interface MatchRowProps {
  fixture: Fixture
  /** Meta-línea (fecha + competición) — solo la usa la pantalla Equipo (§ 10.3). */
  metaLine?: { dateLabel: string }
}

/**
 * Fila de partido (docs/design.md § 7) — unidad que reusan Inicio, Competición y
 * Equipo. Implementa la variante sin escudo (§ 7.4, canónica hoy) en sus dos
 * disposiciones: compacta (320–767px, § 7.0, la base) y amplia (≥768px, § 8.4,
 * fila simétrica con eje central de 96px fijos — cerrado por el usuario).
 *
 * Las dos disposiciones se renderizan ambas y se alternan por CSS (`wide:hidden` /
 * `wide:grid`), no por JS: nada de layout thrash ni de detectar el viewport en
 * tiempo de ejecución, y el breakpoint es siempre el único token del proyecto
 * (`--bp-wide` → variante Tailwind `wide:`).
 */
export function MatchRow({ fixture, metaLine }: MatchRowProps) {
  const presentation = useMemo(() => getMatchRowPresentation(fixture), [fixture])
  const { timeLabel, timeColorClassName, subLine, statusBadge, wideStatusWord, home, away } =
    presentation
  const hasScore = home !== null && away !== null
  const axisTimeColorClassName = timeLabel === '—' ? 'text-text-3' : 'text-text-1'

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Compacta — grid de tres columnas 48px | 1fr | 24px (§ 7.0). */}
      <div
        data-testid="match-row-compact"
        className="grid min-h-14 grid-cols-[48px_1fr_24px] items-start gap-3 p-3 wide:hidden"
      >
        <div className="tnum flex flex-col text-sm">
          <span className={timeColorClassName}>{timeLabel}</span>
          {subLine && (
            <span className={`text-xs font-semibold ${subLine.colorClassName}`}>
              {subLine.text}
            </span>
          )}
        </div>

        <div className="min-w-0">
          {metaLine && (
            <MatchMetaLine dateLabel={metaLine.dateLabel} competition={fixture.competition} />
          )}
          <div className="flex flex-col">
            <TeamNameLink team={fixture.homeTeam} />
            <TeamNameLink team={fixture.awayTeam} />
          </div>
          {statusBadge && (
            <div className="mt-1">
              <StatusBadge {...statusBadge} />
            </div>
          )}
        </div>

        <div className={`tnum flex flex-col items-end text-lg ${metaLine ? 'mt-4' : ''}`}>
          {home && (
            <span className={`${home.weightClassName} ${home.colorClassName}`}>{home.value}</span>
          )}
          {away && (
            <span className={`${away.weightClassName} ${away.colorClassName}`}>{away.value}</span>
          )}
        </div>
      </div>

      {/* Amplia — fila simétrica: eje central de ancho fijo (96px), meta-línea
          y estado como filas propias de ancho completo (§ 8.4). */}
      <div
        data-testid="match-row-wide"
        className="hidden min-h-14 wide:grid wide:grid-cols-[1fr_96px_1fr] wide:items-center wide:gap-x-4 wide:gap-y-0 wide:px-4 wide:py-3"
      >
        {metaLine && (
          <div className="col-span-full flex justify-center">
            <MatchMetaLine
              dateLabel={metaLine.dateLabel}
              competition={fixture.competition}
              align="center"
            />
          </div>
        )}

        <div className="flex min-w-0 justify-end">
          <TeamNameLink team={fixture.homeTeam} />
        </div>

        <div className="tnum flex items-baseline justify-center gap-2">
          {hasScore ? (
            <>
              <span className={`text-xl ${home.weightClassName} ${home.colorClassName}`}>
                {home.value}
              </span>
              <span className="text-lg text-text-3">–</span>
              <span className={`text-xl ${away.weightClassName} ${away.colorClassName}`}>
                {away.value}
              </span>
            </>
          ) : (
            <span className={`text-xl font-semibold ${axisTimeColorClassName}`}>{timeLabel}</span>
          )}
        </div>

        <div className="flex min-w-0 justify-start">
          <TeamNameLink team={fixture.awayTeam} />
        </div>

        {(wideStatusWord || hasScore) && (
          <div className="col-span-full flex items-center justify-center gap-2">
            {hasScore && (
              <>
                <span className="tnum text-xs font-medium text-text-2">{timeLabel}</span>
                {wideStatusWord && (
                  <span aria-hidden="true" className="text-xs text-text-3">
                    ·
                  </span>
                )}
              </>
            )}
            {wideStatusWord && <StatusBadge {...wideStatusWord} />}
          </div>
        )}
      </div>
    </div>
  )
}
