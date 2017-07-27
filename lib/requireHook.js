const babelRegister = require('babel-register')

module.exports = (options = {}) => {
  babelRegister({
    cache: !!options.requireHookCache,
    extensions: options.requireHookExtensions || ['.es6', '.es', '.jsx', '.js'],
    ignore: options.requireHookIgnore || false
    // only: options.requireHookOnly
  })
}
