import { useTheme, type ThemeChoice } from '../lib/theme'
import { MonitorIcon, MoonIcon, SunIcon } from './Icons'

const next: Record<ThemeChoice, ThemeChoice> = { system: 'light', light: 'dark', dark: 'system' }
const icons = { system: MonitorIcon, light: SunIcon, dark: MoonIcon }

export default function ThemeToggle () {
  const [choice, setChoice] = useTheme()
  const Icon = icons[choice]
  const label = `Color mode: ${choice}. Switch to ${next[choice]}.`

  return (
    <button
      type='button'
      onClick={() => setChoice(next[choice])}
      className='inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-text'
      aria-label={label}
      title={label}
    >
      <Icon />
    </button>
  )
}
