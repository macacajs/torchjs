const getOptions = require('mocha/bin/options')
const url = require('url')
const {
  each
} = require('lodash')
const {
  resolve
} = require('path')
const {
  BrowserWindow,
  app,
  ipcMain
} = require('electron')
const parseArgs = require('./lib/parseArgs')
const runMocha = require('./lib/runMocha')

// load mocha.opts into process.argv
getOptions()

// opts
const opts = parseArgs(process.argv)

// `--require-main` scripts
if (opts.requireMain.length) {
  try {
    each(opts.requireMain, mainModule => {
      require(mainModule)
    })
  } catch (error) {
    fail(error)
  }
}

// quit
app.on('quit', () => { })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  app.exit(1)
})
app.on('ready', () => {
  if (opts.interactive) {
    opts.renderer = true
    opts.debug = true
    opts.reporter = 'HTML'
  }
  if (!opts.renderer) {
    try {
      runMocha(opts, count => app.exit(count))
    } catch (error) {
      fail(error)
    }
  } else {
    const indexUrl = url.format({
      hash: encodeURIComponent(JSON.stringify(opts)),
      pathname: resolve(__dirname, './renderer/index.html'),
      protocol: 'file:',
      slashes: true
    })
    let win = new BrowserWindow({
      focusable: opts.debug,
      height: opts.height,
      show: false,
      webPreferences: {
        webSecurity: false
      },
      width: opts.width
    })
    if (!opts.debug && process.platform === 'darwin') {
      app.dock.hide()
    }
    win.on('closed', () => {
      win = null
    })
    win.webContents.once('did-finish-load', () => {
      if (opts.debug) {
        win.show()
        win.webContents.openDevTools()
        win.webContents.on('devtools-opened', () => {
          // Debugger is not immediately ready!
          setTimeout(() => {
            win.webContents.send('mocha-start')
          }, 250)
        })

        // Called on reload in --interactive mode
        ipcMain.on('mocha-ready-to-run', () => {
          win.webContents.send('mocha-start')
        })
      } else {
        win.webContents.send('mocha-start')
      }
    })
    // win.webContents.once('did-fail-load', (event, errorCode, errorDescription) => {
    //   console.log(errorCode, errorDescription)
    // })
    ipcMain.on('mocha-done', (event, count) => {
      win.webContents.once('destroyed', () => app.exit(count))
      if (!opts.interactive) {
        win.close()
      }
    })
    ipcMain.on('mocha-error', (_, error) => fail(error))

    win.loadURL(indexUrl)
  }
})

function fail (error) {
  console.error(error.message)
  console.error(error.stack)
  app.exit(1)
}
