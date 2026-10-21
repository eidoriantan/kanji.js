import type { ReactNode } from 'react'

interface Props {
  title?: string
  tone?: 'note' | 'warning'
  children: ReactNode
}

export default function Callout ({ title, tone = 'note', children }: Props) {
  const toneClass = tone === 'warning'
    ? 'border-primary/40 bg-primary/[0.06]'
    : 'border-border bg-surface'

  return (
    <aside className={`rounded-lg border px-4 py-3 text-sm leading-6 ${toneClass} [&_p]:max-w-none [&>*+*]:mt-2`}>
      {title && (
        <p className={`font-bold ${tone === 'warning' ? 'text-primary' : ''}`}>{title}</p>
      )}
      {children}
    </aside>
  )
}
