
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

const production = process.env.NODE_ENV === 'production'
const outputs = [{
  file: 'dist/kanji.js',
  format: 'umd',
  name: 'Kanji'
}]

if (production) {
  outputs.push({
    file: 'dist/kanji.min.js',
    format: 'umd',
    name: 'Kanji',
    plugins: [terser()]
  })
}

export default {
  input: 'src/kanji.mjs',
  strictDeprecations: true,
  output: outputs,
  plugins: [commonjs(), resolve()],
  watch: { include: ['src/**/*.mjs'] }
}
