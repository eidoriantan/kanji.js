import { useEffect, useState } from 'react'
import { CheckIcon, CopyIcon } from './Icons'

export default function CopyButton ({ text, className = '' }: { text: string, className?: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(id)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {}
  }

  return (
    <button
      type='button'
      onClick={copy}
      className={`inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-border/60 hover:text-text ${className}`}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      title={copied ? 'Copied' : 'Copy'}
    >
      {copied ? <CheckIcon className='text-primary' /> : <CopyIcon />}
    </button>
  )
}
