module.exports = {
  babelrc: {
    presets: [
      '@babel/env'
    ],
    sourceMaps: 'inline'
  },
  extensions: ['.es6', '.es', '.jsx', '.js'],
  include: [
    'test/renderer/**',
  ],
  exclude: [
    'bower_components/**',
    'node_modules/**'
  ]
}
