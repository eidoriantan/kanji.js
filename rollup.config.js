
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/kanji.mjs',
  strictDeprecations: true,
  output: [{
    file: 'dist/kanji.js',
    format: 'umd',
    name: 'Kanji'
  }, {
    file: 'dist/kanji.min.js',
    format: 'umd',
    name: 'Kanji',
    plugins: terser()
  }],
  plugins: [
    commonjs(),
    resolve()
  ],
  watch: {
    include: ['src/**/*.mjs']
  }
}
