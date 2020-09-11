import { isUndef } from '../../../src/libs/helper';

describe('libs/helper', () => {
  it('isUndef', () => {
    expect(isUndef(null)).toBe(true);
  });
});
