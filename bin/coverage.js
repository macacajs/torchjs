#!/usr/bin/env node
const path = require('path')
const launchElectronApp = require('../lib/launchElectronApp')

launchElectronApp(path.resolve(__dirname, '../coverage.js'))
