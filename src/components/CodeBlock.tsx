import { Highlight, type PrismTheme } from 'prism-react-renderer'
import CopyButton from './CopyButton'

const theme: PrismTheme = {
  plain: { color: 'var(--text)', backgroundColor: 'transparent' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'var(--code-com)', fontStyle: 'italic' } },
    { types: ['keyword', 'tag', 'boolean', 'null', 'undefined', 'operator'], style: { color: 'var(--code-kw)' } },
    { types: ['string', 'char', 'attr-value', 'number', 'template-string', 'regex'], style: { color: 'var(--code-str)' } },
    { types: ['function', 'attr-name', 'class-name', 'maybe-class-name'], style: { color: 'var(--code-fn)', fontWeight: '500' } },
    { types: ['punctuation'], style: { color: 'var(--muted)' } }
  ]
}

export type Lang = 'js' | 'ts' | 'html' | 'shell' | 'json'

const prismLang: Record<Lang, string> = {
  js: 'jsx',
  ts: 'tsx',
  html: 'markup',
  shell: 'shell',
  json: 'json'
}

interface Props {
  code: string
  lang?: Lang
  title?: string
}

export default function CodeBlock ({ code, lang = 'js', title }: Props) {
  const source = code.replace(/^\n+|\s+$/g, '')

  return (
    <div className='group relative overflow-hidden rounded-lg border border-border bg-code-bg'>
      {title && (
        <div className='border-b border-border px-4 py-2 font-mono text-xs text-muted'>{title}</div>
      )}
      <CopyButton text={source} className='absolute right-2 top-2 bg-code-bg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100' />
      {lang === 'shell'
        ? (
          <pre className='overflow-x-auto py-3.5 pl-4 pr-12 font-mono text-[13px] leading-6'>
            {source.split('\n').map((line, i) => (
              <div key={i}><span className='select-none text-muted'>$ </span>{line}</div>
            ))}
          </pre>
          )
        : (
          <Highlight code={source} language={prismLang[lang]} theme={theme}>
            {({ tokens, getLineProps, getTokenProps }) => (
              <pre className='overflow-x-auto py-3.5 pl-4 pr-12 font-mono text-[13px] leading-6'>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
          )}
    </div>
  )
}
