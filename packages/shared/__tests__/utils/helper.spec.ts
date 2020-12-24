import { isUndef } from '@vueposu/shared';

describe('utils/helper', () => {
  it('isUndef', () => {
    expect(isUndef(null)).toBe(true);
  });
});
