import { useMemo } from 'react'
import { MatchMetaLine } from './MatchMetaLine'
import { getMatchRowPresentation } from './matchRowPresentation'
import { StatusBadge } from './StatusBadge'
import { TeamNameLink } from './TeamNameLink'
import type { Fixture } from '../../types/fixture'

interface MatchRowProps {
  fixture: Fixture
  /** Meta-línea (fecha + hora + competición) — solo la usa la pantalla Equipo (§ 10.3). */
  showMetaLine?: boolean
}

/**
 * Bloque de partido (docs/design.md § 7) — unidad que reusan Inicio (en sus
 * dos vistas), Competición y Equipo. Implementa la variante sin escudo (§ 7.4,
 * canónica hoy) en sus dos disposiciones: compacta (320–767px, § 7.0, la base)
 * y amplia (≥768px, § 8.4, fila simétrica con eje central de 92px fijos).
 *
 * La hora **no** vive acá — salió del bloque (§ 7.0): vive siempre en el
 * envoltorio de grupo (titular/subtítulo) o, en Equipo, en la meta-línea.
 *
 * Las dos disposiciones se renderizan ambas y se alternan por CSS (`wide:hidden` /
 * `wide:grid`), no por JS: nada de layout thrash ni de detectar el viewport en
 * tiempo de ejecución, y el breakpoint es siempre el único token del proyecto
 * (`--bp-wide` → variante Tailwind `wide:`).
 */
export function MatchRow({ fixture, showMetaLine = false }: MatchRowProps) {
  const { statusLine, home, away } = useMemo(() => getMatchRowPresentation(fixture), [fixture])
  const hasScore = home !== null && away !== null
  // § 8.4 — el en dash del eje sin marcador se aclara a --color-border; con
  // marcador presente pasa a --color-text-3 (no es un dato, separa dos números).
  const separatorColorClassName = hasScore ? 'text-text-3' : 'text-border'

  return (
    <div className="border-b border-border last:border-b-0">
      {/* Compacta (§ 7.0): dos líneas de equipo (28px c/u) + línea de estado. */}
      <div data-testid="match-row-compact" className="py-2 wide:hidden">
        {showMetaLine && <MatchMetaLine fixture={fixture} />}

        <div className="flex min-h-7 items-center gap-2">
          <TeamNameLink team={fixture.homeTeam} />
          <span className="tnum ml-auto w-6 shrink-0 text-right text-lg">
            {home && (
              <span className={`${home.weightClassName} ${home.colorClassName}`}>{home.value}</span>
            )}
          </span>
        </div>
        <div className="flex min-h-7 items-center gap-2">
          <TeamNameLink team={fixture.awayTeam} />
          <span className="tnum ml-auto w-6 shrink-0 text-right text-lg">
            {away && (
              <span className={`${away.weightClassName} ${away.colorClassName}`}>{away.value}</span>
            )}
          </span>
        </div>

        <div className="mt-1 flex min-h-4 items-center gap-2">
          {statusLine && <StatusBadge {...statusLine} />}
        </div>
      </div>

      {/* Amplia (§ 8.4): fila simétrica de 7 columnas, eje central de ancho fijo
          (92px = 28 + 8 + 20 + 8 + 28); meta-línea y estado son filas propias de
          ancho completo. Columnas 2 y 6 (escudo) miden 0 con la variante 1
          vigente (§ 7.4) — se reservan igual para no rehacer la grilla el día
          que lleguen los escudos. */}
      <div
        data-testid="match-row-wide"
        className="hidden wide:grid wide:grid-cols-[1fr_0_28px_20px_28px_0_1fr] wide:items-center wide:gap-x-2 wide:py-2"
      >
        {showMetaLine && (
          <div className="col-span-full flex justify-center">
            <MatchMetaLine fixture={fixture} align="center" />
          </div>
        )}

        <div className="flex min-h-8 min-w-0 items-center justify-end">
          <TeamNameLink team={fixture.homeTeam} />
        </div>
        <div aria-hidden="true" />
        <div className="tnum flex items-center justify-end text-xl">
          {home && (
            <span className={`${home.weightClassName} ${home.colorClassName}`}>{home.value}</span>
          )}
        </div>
        <div className="flex items-center justify-center text-lg">
          <span aria-hidden="true" className={separatorColorClassName}>
            –
          </span>
        </div>
        <div className="tnum flex items-center justify-start text-xl">
          {away && (
            <span className={`${away.weightClassName} ${away.colorClassName}`}>{away.value}</span>
          )}
        </div>
        <div aria-hidden="true" />
        <div className="flex min-h-8 min-w-0 items-center justify-start">
          <TeamNameLink team={fixture.awayTeam} />
        </div>

        <div className="col-span-full mt-1 flex min-h-4 items-center justify-center gap-2">
          {statusLine && <StatusBadge {...statusLine} />}
        </div>
      </div>
    </div>
  )
}
