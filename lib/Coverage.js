const glob = require('glob')
const isRenderer = require('is-electron-renderer')
const {
  readFileSync
} = require('fs')
const {
  assign,
  each,
  forIn,
  isArray
} = require('lodash')
const {
  Reporter,
  Instrumenter,
  Collector,
  hook
} = require('istanbul')

class Coverage {
  constructor (root, pattern) {
    const me = this
    assign(me, {
      root,
      pattern,
      instrumenter: new Instrumenter()
    })
    me.transformer = me.instrumenter.instrumentSync.bind(me.instrumenter)
    me.matched = me._match()
    if (isRenderer) {
      me.cov = window.__coverage__ = {}
    } else {
      me.cov = global.__coverage__ = {}
    }
    hook.hookRequire(me.matched, me.transformer, {})
  }

  _match () {
    const me = this
    const root = me.root
    const pattern = me.pattern
    const map = {}
    const fn = function (file) {
      return map[file]
    }
    if (typeof pattern === 'string') {
      fn.files = glob.sync(pattern, {
        root,
        realpath: true
      })
    } else if (isArray(pattern)) {
      fn.files = []
      each(pattern, p => {
        const files = glob.sync(p, {
          root,
          realpath: true
        })
        fn.files = fn.files.concat(files)
      })
    }
    each(fn.files, file => {
      map[file] = true
    })
    return fn
  }

  report (done) {
    const me = this
    const files = me.matched.files
    const cov = me.cov
    const instrumenter = me.instrumenter
    each(files, file => {
      if (!cov[file]) {
        me.transformer(readFileSync(file, 'utf-8'), file)
        forIn(instrumenter.coverState.s, (value, key) => {
          instrumenter.coverState.s[key] = 0
        })
        cov[file] = instrumenter.coverState
      }
    })

    const collector = new Collector()
    collector.add(cov)
    const reporter = new Reporter()
    reporter.addAll(['lcov'])
    reporter.write(collector, true, () => {})
  }
}

module.exports = Coverage
