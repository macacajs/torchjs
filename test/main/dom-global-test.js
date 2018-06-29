/* eslint-env mocha */
const assert = require('assert')

describe('--dom-global-loose', () => {
  it('window is not undefined', () => {
    assert.equal(!!window, true)
  })
  it('window properties can be modified in loose mode', () => {
    assert.doesNotThrow(() => {
      window.navigator = {
        userAgent: 'x'
      }
    })
  })
})
