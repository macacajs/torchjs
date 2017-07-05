const commander = require('commander')
const {
  each
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
  return str.split(/*, */)
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
    .option('--compilers <ext>:<module>,...', 'use the given module(s) to compile files', list, [])
    .option('--debug', 'enable Electron debugger on port [5858]; for --renderer tests show window and dev-tools')
    .option('--debug-brk', 'like --debug but pauses the script on the first line')
    .option('--globals <names>', 'allow the given comma-delimited global [names]', list, [])
    .option('--inline-diffs', 'display actual/expected differences inline within each string')
    .option('--interactive', 'run tests in renderer process in a visible window that can be reloaded to re-run tests')
    .option('--interfaces', 'display available interfaces')
    .option('--no-timeouts', 'disables timeouts')
    .option('--opts <path>', 'specify opts path', 'test/mocha.opts')
    .option('--recursive', 'include sub directories')
    .option('--renderer', 'run tests in renderer process')
    .option('--preload <name>', 'preload the given script in renderer process', modules, [])
    .option('--require-main <name>', 'load the given script in main process before executing tests', modules, [])

  commander.parse(argv)
  const argData = JSON.parse(JSON.stringify(commander))
  argData.files = argData.args

  if (argData.debugBrk) {
    argData.debug = true
  }

  // reporter options
  const reporterOptions = {}
  if (commander.reporterOptions !== undefined) {
    each(commander.reporterOptions.split(','), opt => {
      const L = opt.split('=')
      if (L.length > 2 || L.length === 0) {
        throw new Error(`invalid reporter option '${opt}'`)
      } else if (L.length === 2) {
        reporterOptions[L[0]] = L[1]
      } else {
        reporterOptions[L[0]] = true
      }
    })
  }
  argData.reporterOptions = reporterOptions

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
