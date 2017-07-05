/* global describe it */
const assert = require('assert')

describe('torch', () => {
  it('runs in main process by default', () => {
    assert.strictEqual(process.type, 'browser')
  })
})
