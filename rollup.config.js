import { terser } from 'rollup-plugin-terser'
import nodeResolve from 'rollup-plugin-node-resolve'

const terse = terser()

export default {
  input: 'index.js',
  output: [{
    file: 'dist/stored-settings.esm.js',
    format: 'esm',
    plugins: [],
    globals: { vue: 'Vue' },
  }, {
    file: 'dist/stored-settings.esm.min.js',
    format: 'esm',
    plugins: [terse],
    globals: { vue: 'Vue' },
  }, {
    file: 'dist/stored-settings.iife.js',
    format: 'iife',
    name: 'StoredSettings',
    plugins: [],
    globals: { vue: 'Vue' },
  }, {
    file: 'dist/stored-settings.iife.min.js',
    format: 'iife',
    name: 'StoredSettings',
    plugins: [terse],
    globals: { vue: 'Vue' },
  }],
  external: ['vue'],
  plugins: [nodeResolve({ browser: true })]
}
