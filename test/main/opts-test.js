const assert = require('assert');

describe('mocha.opts', () => {
  it('--require modules are loaded', () => {
    assert.equal(true, global.required);
  });

  it('--require-main modules are loaded', () => {
    assert.equal(true, global.requiredMain);
  });
});
