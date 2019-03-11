import {
  ok
} from 'assert';

describe('localStorage', () => {
  it('can be accessed', () => {
    window.localStorage.setItem('blah', 'hello storage!');
    ok(window.localStorage.getItem('blah') === 'hello storage!');
  });
});
