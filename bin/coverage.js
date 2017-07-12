#!/usr/bin/env node
const {
  resolve
} = require('path')
const launchElectronApp = require('../lib/launchElectronApp')

launchElectronApp(resolve(__dirname, '../coverage.js'))
