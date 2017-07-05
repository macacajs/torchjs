const Mocha = require('mocha')
const {
  each
} = require('lodash')
const {
  join,
  resolve
} = require('path')

module.exports = (args, callback) => {
  const utils = Mocha.utils
  const mocha = new Mocha()

  mocha.reporter(args.reporter, args.reporterOptions)
  mocha.ui(args.ui)
  if (args.inlineDiffs) {
    mocha.useInlineDiffs(true)
  }
  if (args.slow) {
    mocha.suite.slow(args.slow)
  }
  if (!args.timeouts) {
    mocha.enableTimeouts(false)
  }
  if (args.timeout) {
    mocha.suite.timeout(args.timeout)
  }
  if (args.bail) {
    mocha.bail(args.bail)
  }
  if (args.grep) {
    mocha.grep(new RegExp(args.grep))
  }
  if (args.fgrep) {
    mocha.grep(args.fgrep)
  }
  if (args.invert) {
    mocha.invert()
  }
  if (args.checkLeaks) {
    mocha.checkLeaks()
  }
  mocha.globals(args.globals)
  mocha.useColors(args.colors)

  // default files to test/*.js
  let files = []
  const extensions = ['js']
  if (!args.files.length) {
    args.files.push('test')
  }
  each(args.files, arg => {
    files = files.concat(utils.lookupFiles(arg, extensions, args.recursive))
  })

  each(args.compilers, compilers => {
    let [ext, mod] = compilers.split(':')

    if (mod[0] === '.') {
      mod = join(process.cwd(), mod)
    }
    require(mod)
    extensions.push(ext)
  })

  each(args.require, mod => {
    require(mod)
  })

  files = files.map((file) => resolve(file))

  if (args.sort) {
    files.sort()
  }

  mocha.files = files

  mocha.run(callback)
}
