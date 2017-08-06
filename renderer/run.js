const path = require('path')

const mocha = require('mocha')
const {
  writeFileSync
} = require('fs')
const {
  each
} = require('lodash')
const {
  ipcRenderer
} = require('electron')
const notify = require('../lib/notify')
const Coverage = require('../lib/Coverage')
const runMocha = require('../lib/runMocha')

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
  coverage = new Coverage(opts.root, opts.sourcePattern)
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

// TODO compile
if (opts.compile) {
  require('../lib/requireHook')(opts.compileOpts)
}

try {
  each(opts.preload, file => {
    const fileType = path.extname(file)
    switch (fileType) {
      case '.js': {
        const tag = document.createElement('script')
        tag.src = file
        tag.async = false
        document.head.appendChild(tag)
        console.log(`${file} loaded success!`)
        break
      }
      case '.css': {
        const tag = document.createElement('link')
        tag.rel = 'stylesheet'
        tag.href = file
        document.head.appendChild(tag)
        console.log(`${file} loaded success!`)
        break
      }
    }
  })
} catch (error) {
  reportError(error)
}

ipcRenderer.on('mocha-start', () => {
  try {
    runMocha(opts, count => {
      if (count && opts.notifyOnFail) {
        notify(count)
      }
      if (coverage) {
        coverage.report()
      }
      ipcRenderer.send('mocha-done', count)
    })
  } catch (error) {
    reportError(error)
  }
})

// Request re-run on reload in --interactive mode
ipcRenderer.send('mocha-ready-to-run')

// Expose Macaca inject utils
var queue = []

window.Macaca = {
  screenshot: (options, callback) => {
    queue.push({
      options,
      callback
    })
    ipcRenderer.send('screenshot-start')
  }
}

ipcRenderer.on('screenshot-end', (e, data) => {
  var target = queue.shift()

  if (target) {
    if (target.options && target.options.directory) {
      var directory = path.resolve(target.options.directory)
      console.log(`screenshot was saved to ${directory}`)
      writeFileSync(directory, data.base64, 'base64')
    }

    target.callback({
      action: 'screenshot',
      data
    })
  }
})
