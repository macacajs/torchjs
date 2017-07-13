/* eslint-env mocha */
const assert = require('assert')

describe('localStorage', () => {
  it('can be accessed', () => {
    window.localStorage.setItem('blah', 'hello storage!')
    assert.ok(window.localStorage.getItem('blah') === 'hello storage!')
  })
})
