const {
  app,
  BrowserWindow
} = require('electron')
const {
  resolve
} = require('path')
const url = require('url')
const windowBoundsConfig = require('./lib/windowBoundsConfig')(resolve(app.getPath('userData'), './torch-config.json'))

let win

function createWindow () {
  win = new BrowserWindow(windowBoundsConfig.get('coverage'))

  win.loadURL(url.format({
    pathname: resolve(process.cwd(), './coverage/lcov-report/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // win.webContents.openDevTools();
  win.on('close', () => {
    windowBoundsConfig.set('coverage', win.getBounds())
  })
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  app.exit()
})
