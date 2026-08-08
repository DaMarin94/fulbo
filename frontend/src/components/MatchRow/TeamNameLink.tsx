import { Link } from 'react-router-dom'
import type { Team } from '../../types/fixture'

/**
 * Separa un nombre de equipo en base + sufijo desambiguador entre paréntesis
 * (docs/design.md § 7.5), ej. "Central Córdoba (SdE)" → ["Central Córdoba", "(SdE)"].
 * Si no hay paréntesis, no hay sufijo: se devuelve el nombre completo como base.
 */
export function splitTeamName(name: string): { base: string; suffix: string | null } {
  const match = name.match(/^(.*\S)\s*(\([^()]+\))\s*$/)
  if (!match) return { base: name, suffix: null }
  return { base: match[1], suffix: match[2] }
}

interface TeamNameLinkProps {
  team: Team
}

/**
 * Nombre de equipo, link a la pantalla Equipo (§ 3.3). Trunca a una línea con
 * elipsis; el sufijo entre paréntesis está protegido del truncado y solo cede
 * cuando por sí mismo supera la mitad del bloque de nombres (§ 7.5).
 */
export function TeamNameLink({ team }: TeamNameLinkProps) {
  const { base, suffix } = splitTeamName(team.name)
  return (
    <Link
      to={`/equipo/${team.id}`}
      title={team.name}
      aria-label={team.name}
      className="link-underline flex min-w-0 items-baseline gap-1 py-1 text-base font-medium text-text-1"
    >
      <span className="min-w-0 truncate">{base}</span>
      {suffix && <span className="max-w-[50%] shrink-0 truncate">{suffix}</span>}
    </Link>
  )
}
