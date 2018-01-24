const JSDOM = require('jsdom').JSDOM

const dom = new JSDOM('<!doctype html><html><body></body></html>')
global.window = dom.window
global.document = window.document
global.navigator = window.navigator

for (const key in window) {
  if (!window.hasOwnProperty(key)) continue
  if (key in global) continue
  global[key] = window[key]
}
window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  }
}
