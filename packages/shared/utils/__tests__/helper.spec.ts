import { isUndef } from '../helper';

describe('libs/helper', () => {
  it('isUndef', () => {
    expect(isUndef(null)).toBe(true);
  });
});
