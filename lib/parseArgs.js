const commander = require('commander')
const {
  each,
  extend,
  isNil
} = require('lodash')
const {
  existsSync
} = require('fs')
const {
  join,
  resolve
} = require('path')
const pkg = require('../package.json')

const cwd = process.cwd()
module.paths.push(cwd, join(cwd, 'node_modules'))

function list (str) {
  return str.split(/[\s,]\s*/)
}
function modules (mod, memo) {
  const abs = existsSync(mod) || existsSync(mod + '.js')
  if (abs) mod = resolve(mod)
  memo.push(mod)
  return memo
}

module.exports = (argv) => {
  commander._name = 'torch'
  commander
    .version(pkg.version)
    .option('-C, --no-colors', 'force disabling of colors')
    .option('-O, --reporter-options <k=v,k2=v2,...>', 'reporter-specific options')
    .option('-R, --reporter <name>', 'specify the reporter to use', 'spec')
    .option('-S, --sort', 'sort test files')
    .option('-b, --bail', 'bail after first test failure')
    .option('-g, --grep <pattern>', 'only run tests matching <pattern>')
    .option('-f, --fgrep <string>', 'only run tests containing <string>')
    .option('-i, --invert', 'inverts --grep and --fgrep matches')
    .option('-r, --require <name>', 'require the given module', modules, [])
    .option('-s, --slow <ms>', '"slow" test threshold in milliseconds [75]')
    .option('-t, --timeout <ms>', 'set test-case timeout in milliseconds [2000]')
    .option('-u, --ui <name>', 'specify user-interface (bdd|tdd|exports)', 'bdd')
    .option('--check-leaks', 'check for global variable leaks')
    .option('--compile', 'compile with babel')
    .option('--compile-opts <path>', 'path of compile options')
    .option('--compilers <ext>:<module>,...', 'use the given module(s) to compile files', list, [])
    .option('--coverage', 'report coverage')
    .option('--debug', 'enable Electron debugger on port [5858]; for --renderer tests show window and dev-tools')
    .option('--debug-brk', 'like --debug but pauses the script on the first line')
    .option('--globals <names>', 'allow the given comma-delimited global [names]', list, [])
    .option('--inline-diffs', 'display actual/expected differences inline within each string')
    .option('--interactive', 'run tests in renderer process in a visible window that can be reloaded to re-run tests')
    .option('--interfaces', 'display available interfaces')
    .option('--no-timeouts', 'disables timeouts')
    .option('--notify-on-fail', 'notify on failures')
    .option('--opts <path>', 'specify opts path', 'test/mocha.opts')
    .option('--preload <name>', 'preload the given script in renderer process', modules, [])
    .option('--recursive', 'include sub directories')
    .option('--renderer', 'run tests in renderer process')
    .option('--require-main <name>', 'load the given script in main process before executing tests', modules, [])
    .option('--source-pattern <sources>', 'glob pattern of source files', list, ['index.js', 'lib/**/*.js', 'src/**/*.js'])
    .option('--watch', 'watching source file changes')
    .option('--watch-aggregate-timeout', 'delay time for re-run test cases after files changed', 1000)

  commander.parse(argv)
  const argData = JSON.parse(JSON.stringify(commander))
  argData.files = argData.args

  if (argData.debugBrk) {
    argData.debug = true
  }

  // reporter options
  const reporterOpts = {}
  if (!isNil(commander.reporterOpts)) {
    each(commander.reporterOpts.split(','), opt => {
      const L = opt.split('=')
      if (L.length > 2 || L.length === 0) {
        throw new Error(`invalid reporter option '${opt}'`)
      } else if (L.length === 2) {
        reporterOpts[L[0]] = L[1]
      } else {
        reporterOpts[L[0]] = true
      }
    })
  }
  argData.reporterOpts = reporterOpts

  // compile options
  if (commander.compile) {
    argData.compileOpts = {
      babelrc: {
        presets: [
          'es2015',
          'stage-0'
        ],
        sourceMaps: 'inline'
      },
      extensions: ['.es6', '.es', '.jsx', '.js'],
      include: [
        'index.js',
        'lib/**/*.js',
        'src/**/*.js'
      ],
      exclude: [
        'bower_components/**',
        'node_modules/**'
      ]
    }

    const optsPathname = resolve(cwd, commander.compileOpts || './.torch.compile.opts.js')
    let specifiedOpts
    try {
      specifiedOpts = require(optsPathname)
    } catch (e) {
    }
    extend(argData.compileOpts, specifiedOpts)
  }

  // delete unused
  const UNUSED_KEYS = [
    '_args',
    '_events',
    '_eventsCount',
    '_execs',
    '_name',
    '_usage',
    '_version',
    'args',
    'commands',
    'options'
  ]
  each(UNUSED_KEYS, key => {
    delete argData[key]
  })

  return argData
}
