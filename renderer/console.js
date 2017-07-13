const {
  assign,
  map,
  toArray,
  toString
} = require('lodash')
const {
  remote
} = require('electron')
const remoteConsole = remote.require('console')

// we have to do this so that mocha output doesn't look like shit
console.log = function () {
  remoteConsole.log.apply(remoteConsole, map(toArray(arguments), arg => toString(arg)))
}
console.dir = function () {
  remoteConsole.log.apply(remoteConsole, map(toArray(arguments), arg => toString(arg)))
}

// if we don't do this, we get socket errors and our tests crash
assign(process, {
  stdout: {
    value: remote.process.stdout
  }
})
