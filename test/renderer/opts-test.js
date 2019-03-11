import {
  equal
} from 'assert';
import {
  remote
} from 'electron';

describe('mocha.opts', () => {
  it('--require modules are loaded', () => {
    equal(true, window.required);
  });

  it('--require-main modules are loaded in the main process', () => {
    equal(true, remote.getGlobal('requiredMain'));
  });

  it('--preload scripts are loaded', () => {
    equal(true, window.preloaded);
  });
});
