import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ContrastIcon } from './icons/ContrastIcon'
import { MoonIcon } from './icons/MoonIcon'
import { SunIcon } from './icons/SunIcon'
import type { IconProps } from './icons/types'
import { useTheme } from '../theme/ThemeProvider'
import type { ThemePreference } from '../theme/theme'

interface ThemeOption {
  value: ThemePreference
  /** Palabra visible en el segmento. */
  label: string
  /** Nombre accesible completo (WCAG 2.5.3 Label in Name: "Auto" es prefijo de "Automático"). */
  accessibleName: string
  Icon: (props: IconProps) => React.JSX.Element
}

const OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Claro', accessibleName: 'Claro', Icon: SunIcon },
  { value: 'dark', label: 'Oscuro', accessibleName: 'Oscuro', Icon: MoonIcon },
  { value: 'auto', label: 'Auto', accessibleName: 'Automático', Icon: ContrastIcon },
]

/**
 * Control segmentado de tema (RF-007, docs/design.md § 6.1). Tres opciones
 * excluyentes, `role="radiogroup"` + roving tabindex con flechas ← → y
 * envolvimiento. El indicador de selección es el único uso de la marca como
 * superficie (§ 3.2, cuarto uso permitido).
 */
export function ThemeControl() {
  const { preference, setPreference } = useTheme()
  const selectedIndex = OPTIONS.findIndex((option) => option.value === preference)
  const [activeIndex, setActiveIndex] = useState(selectedIndex === -1 ? 0 : selectedIndex)
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  function focusAndSelect(index: number) {
    const wrapped = (index + OPTIONS.length) % OPTIONS.length
    setActiveIndex(wrapped)
    setPreference(OPTIONS[wrapped].value)
    buttonRefs.current[wrapped]?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusAndSelect(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusAndSelect(index - 1)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Tema"
      className="w-full max-w-[360px] rounded-md border border-border bg-bg p-1"
    >
      <div className="relative grid grid-cols-3">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 rounded-sm bg-brand-soft transition-transform duration-[120ms] ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(${Math.max(selectedIndex, 0) * 100}%)` }}
        />
        {OPTIONS.map((option, index) => {
          const selected = option.value === preference
          return (
            <button
              key={option.value}
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={option.accessibleName}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => {
                setActiveIndex(index)
                setPreference(option.value)
              }}
              onFocus={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`relative z-10 flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-sm p-0 text-sm transition-colors ${
                selected
                  ? 'font-semibold text-text-1'
                  : 'font-medium text-text-2 hover:bg-surface-2 hover:text-text-1'
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:bg-brand-soft active:text-brand-strong`}
            >
              <option.Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
