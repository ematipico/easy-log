// rollup.config.js
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'

export default {
  entry: 'src/index.js',
  targets: [
    {
      dest: 'playground/js.performance.es.js', // equivalent to --output
      format: 'es',
      sourcemapFile: true
    }
  ],
  plugins: [
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}
