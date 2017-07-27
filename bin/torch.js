#!/usr/bin/env node
const path = require('path')
const launchElectronApp = require('../lib/launchElectronApp')

// const argvStr = process.argv.slice(2).join('')
// const entry = argvStr.indexOf('--compiled') > -1 ? '../entry/compiled.js' : '../index.js'
// TODO waiting for [electron-compilei#230](https://github.com/electron/electron-compile/issues/230)
const entry = '../index.js'

launchElectronApp(path.resolve(__dirname, entry))
