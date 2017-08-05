/* eslint-env mocha */
const {
  resolve
} = require('path')
const assert = require('assert')

const Coverage = require('../../lib/Coverage')

describe('torch', () => {
  it('runs in main process by default', () => {
    assert.strictEqual(process.type, 'browser')
  })
})

describe('coverage', () => {
  const coverage = new Coverage(resolve(__dirname, './'), ['./*.js'])
  it('constructor', () => {
    assert.equal(typeof coverage.matched.files, 'object')
  })
})
