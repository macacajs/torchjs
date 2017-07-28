/* eslint node/no-deprecated-api: 0 */
const sourceMapSupport = require('source-map-support')
const minimatch = require('minimatch')
const {
  readFileSync
} = require('fs')
const {
  dirname,
  relative
  // resolve
} = require('path')
const {
  OptionManager,
  transform
} = require('babel-core')
const {
  extend,
  some
} = require('lodash')

let oldHandlers = {}
const maps = {}
const cwd = process.cwd()

sourceMapSupport.install({
  handleUncaughtExceptions: false,
  environment: 'node',
  retrieveSourceMap (source) {
    const map = maps && maps[source]
    if (map) {
      return {
        url: null,
        map: map
      }
    } else {
      return null
    }
  }
})

const babelrc = {}

function compile (filename) {
  // merge in base options and resolve all the plugins and presets relative to this file
  const transformOpts = new OptionManager().init(extend({}, babelrc, {
    sourceRoot: dirname(filename),
    filename
  }))
  const transformed = transform(readFileSync(filename, 'utf8'), transformOpts)
  return transformed.code
}

function loader (m, filename) {
  m._compile(compile(filename), filename)
}

function isMatching (filename, patterns) {
  return some(patterns, pattern => {
    const result = minimatch(filename, pattern, {
      dot: true
    })
    return result
  })
}

function shouldIgnore (filename, include, exclude) {
  const relativeFilename = relative(cwd, filename)
  if (include.length === 0) {
    return isMatching(relativeFilename, exclude)
  }
  if (exclude.length === 0) {
    return !isMatching(relativeFilename, include)
  }
  return !isMatching(relativeFilename, include) || isMatching(relativeFilename, exclude)
}

function registerExtension (ext, options) {
  const old = oldHandlers[ext] || oldHandlers['.js'] || require.extensions['.js']
  const {
    include = [],
    exclude = []
  } = options

  require.extensions[ext] = (m, filename) => {
    // ignore
    if (shouldIgnore(filename, include, exclude)) {
      old(m, filename)
    } else {
      loader(m, filename, old)
    }
  }
}

function hookExtensions (_exts, options) {
  Object.keys(oldHandlers).forEach(function (ext) {
    const old = oldHandlers[ext]
    if (old === undefined) {
      delete require.extensions[ext]
    } else {
      require.extensions[ext] = old
    }
  })

  oldHandlers = {}

  _exts.forEach(function (ext) {
    oldHandlers[ext] = require.extensions[ext]
    registerExtension(ext, options)
  })
}

module.exports = (options = {}) => {
  extend(babelrc, options.babelrc)
  hookExtensions(options.extensions, options)
}
