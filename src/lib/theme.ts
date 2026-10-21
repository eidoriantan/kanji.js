import { useCallback, useEffect, useState } from 'react'

export type ThemeChoice = 'system' | 'light' | 'dark'

const KEY = 'theme'
const media = () => window.matchMedia('(prefers-color-scheme: dark)')

function readChoice (): ThemeChoice {
  try {
    const value = localStorage.getItem(KEY)
    if (value === 'light' || value === 'dark') return value
  } catch {}
  return 'system'
}

function apply (choice: ThemeChoice) {
  const dark = choice === 'dark' || (choice === 'system' && media().matches)
  document.documentElement.classList.toggle('dark', dark)
}

export function useTheme () {
  // Start from 'system' so the first render matches the prerendered HTML, then
  // read the saved choice. The inline script in index.html has already applied
  // the right class, so nothing is re-applied until the choice changes.
  const [choice, setChoice] = useState<ThemeChoice>('system')

  useEffect(() => setChoice(readChoice()), [])

  useEffect(() => {
    if (choice !== 'system') return
    const mq = media()
    const onChange = () => apply('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [choice])

  const update = useCallback((next: ThemeChoice) => {
    try {
      if (next === 'system') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, next)
    } catch {}
    apply(next)
    setChoice(next)
  }, [])

  return [choice, update] as const
}
