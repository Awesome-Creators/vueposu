import { isUndef } from '../helper';

describe('utils/helper', () => {
  it('isUndef', () => {
    expect(isUndef(null)).toBe(true);
  });
});
