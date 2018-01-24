/* eslint-env mocha */
const assert = require('assert')

describe('--dom-global', () => {
  it('window is not undefined', () => {
    assert.equal(!!window, true)
  })
})
