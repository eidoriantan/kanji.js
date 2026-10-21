import { Link } from 'react-router'
import Seo from '../../components/Seo'
import CodeBlock from '../../components/CodeBlock'
import { DocPage, H } from '../../components/DocsLayout'
import { CDN_URL, LIB_VERSION, NPM_URL, RELEASES_URL, STATS } from '../../lib/site'

const toc = [
  { id: 'npm', label: 'npm' },
  { id: 'cdn', label: 'CDN' },
  { id: 'download', label: 'Direct download' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'size', label: 'Bundle size' }
]

export default function Installation () {
  return (
    <DocPage
      title='Installation'
      lead='Install kanji.js from npm, load it from a CDN, or download a built file. All three give you the same library and the same dictionary.'
      toc={toc}
    >
      <Seo title='Installation' description='How to install kanji.js with npm, a CDN script tag, or a direct download.' />

      <H id='npm'>npm</H>
      <p>
        Install the <a href={NPM_URL}>kanji.js package</a> for Node.js projects and for apps built with a bundler such as Vite, webpack or Rollup.
        This is the recommended option.
      </p>
      <CodeBlock lang='shell' code='npm install kanji.js' />
      <p>The package works with other package managers too:</p>
      <CodeBlock lang='shell' code={'yarn add kanji.js\npnpm add kanji.js'} />

      <H id='cdn'>CDN</H>
      <p>
        To use kanji.js in a browser without a build step, add a script tag. The script defines a global <code>Kanji</code> class.
        Pin the version in the URL so a new release can't change your page without warning.
      </p>
      <CodeBlock lang='html' code={`<script src="${CDN_URL}"></script>
<script>
  console.log(Kanji.getDetails('日').meanings)
  // ['day', 'sun', 'Japan', 'counter for days']
</script>`} />
      <p>unpkg serves the same file:</p>
      <CodeBlock lang='html' code={`<script src="https://unpkg.com/kanji.js@${LIB_VERSION}/dist/kanji.min.js"></script>`} />

      <H id='download'>Direct download</H>
      <p>
        Every release on <a href={RELEASES_URL}>GitHub Releases</a> includes the built <code>kanji.min.js</code> file and the source code.
        The <Link to='/downloads'>Downloads page</Link> lists the latest releases.
        Copy <code>kanji.min.js</code> into your project and load it with a script tag, the same way as the CDN option.
      </p>

      <H id='typescript'>TypeScript</H>
      <p>
        The package includes type declarations (<code>index.d.ts</code>), so you don't need to install anything else.
        Import the default export as usual:
      </p>
      <CodeBlock lang='ts' code={`import Kanji from 'kanji.js'

const day = Kanji.getDetails('日')`} />
      <H id='size'>Bundle size</H>
      <p>
        The library includes the whole dictionary, so it's larger than a typical utility library. The minified file is about {STATS.sizeMB} MB,
        or about {STATS.gzipKB} KB over the network with gzip. In a browser app, load it only when it's needed:
      </p>
      <CodeBlock code={`button.addEventListener('click', async () => {
  const { default: Kanji } = await import('kanji.js')
  showResult(Kanji.random())
})`} />
      <p>
        See <Link to='/docs/guides#lazy-load'>Load the library on demand</Link> for more on this.
      </p>
    </DocPage>
  )
}
