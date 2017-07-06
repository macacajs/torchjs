const mocha = require('mocha')
const {
  each
} = require('lodash')
const {
  ipcRenderer
} = require('electron')
const runMocha = require('../lib/runMocha')
const Coverage = require('../lib/Coverage')

let opts = {}

if (window.location.hash) {
  const hash = window.location.hash.slice(1)
  opts = JSON.parse(decodeURIComponent(hash))
}

if (!opts.interactive) {
  require('./console')
}

let coverage
if (opts.coverage) {
  coverage = new Coverage(opts.root, opts.coveragePattern)
}

// Expose mocha
window.mocha = mocha

function reportError ({
  message,
  stack
}) {
  if (opts.interactive) {
    console.error(message)
    console.error(stack)
  } else {
    ipcRenderer.send('mocha-error', {
      message,
      stack
    })
  }
}

try {
  each(opts.preload, script => {
    const tag = document.createElement('script')
    tag.src = script
    tag.async = false
    document.head.appendChild(tag)
  })
} catch (error) {
  reportError(error)
}

ipcRenderer.on('mocha-start', () => {
  try {
    runMocha(opts, (...args) => {
      if (coverage) {
        coverage.report()
      }
      ipcRenderer.send('mocha-done', ...args)
    })
  } catch (error) {
    reportError(error)
  }
})

// Request re-run on reload in --interactive mode
ipcRenderer.send('mocha-ready-to-run')
