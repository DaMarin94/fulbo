import { LibertadoresMarkIcon } from './LibertadoresMarkIcon'
import { PrimeraAMarkIcon } from './PrimeraAMarkIcon'
import { SudamericanaMarkIcon } from './SudamericanaMarkIcon'
import type { IconProps } from './types'

/**
 * Las tres competiciones cerradas de la v1 (docs/requirements.md), por id de
 * mock/backend — atado a los ids fijos de `src/data/mockFixtures.ts` mientras
 * no exista el relevamiento real de API-Football (docs/technical.md § Migraciones
 * y semillas, "PENDIENTE — relevamiento técnico"). Cuando esos ids reales se
 * confirmen, este mapeo es lo único que hay que ajustar.
 */
const MARK_BY_COMPETITION_ID: Record<string, (props: IconProps) => React.JSX.Element> = {
  'primera-a': PrimeraAMarkIcon,
  libertadores: LibertadoresMarkIcon,
  sudamericana: SudamericanaMarkIcon,
}

interface CompetitionMarkIconProps extends IconProps {
  competitionId: string
}

/**
 * Marca de competición (docs/design.md § 5, § 7.3): 18px, `currentColor`,
 * acompaña siempre al nombre (titular, subtítulo o meta-línea) — nunca aparece
 * sola. Si el id no corresponde a ninguna de las tres competiciones cerradas
 * de la v1 (caso de datos de prueba/mock ajenos a la v1), no renderiza nada:
 * no hay una cuarta marca que inventar.
 */
export function CompetitionMarkIcon({ competitionId, ...props }: CompetitionMarkIconProps) {
  const Icon = MARK_BY_COMPETITION_ID[competitionId]
  if (!Icon) return null
  return <Icon {...props} />
}
