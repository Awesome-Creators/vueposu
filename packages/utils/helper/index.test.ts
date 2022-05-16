import { isUndef } from ".";

describe('utils/helper', () => {
  it('isUndef', () => {
    expect(isUndef(null)).toBe(true);
  });
});
