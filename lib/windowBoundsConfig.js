const {
  assign
} = require('lodash')
const {
  readFileSync,
  writeFileSync
} = require('fs')

const DEFAULT_BOUNDS = {
  height: 800,
  width: 1024
}

module.exports = configPath => {
  return {
    get (name) {
      let data = {}
      try {
        data = JSON.parse(readFileSync(configPath, 'utf8'))
      } catch (e) {
        // do nothing
      }
      if (data && data[name] && data[name].bounds) {
        return data[name].bounds
      }
      return DEFAULT_BOUNDS
    },
    set (name, bounds) {
      bounds = bounds || DEFAULT_BOUNDS
      let data = {}
      try {
        data = JSON.parse(readFileSync(configPath, 'utf8'))
      } catch (e) {
        // do nothing
      }
      data[name] = data[name] || {}
      assign(data[name], {
        bounds
      })
      writeFileSync(configPath, JSON.stringify(data))
    }
  }
}
