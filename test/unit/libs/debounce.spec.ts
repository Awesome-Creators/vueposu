import debounce from '@libs/debounce';
import { times, wait } from '@test/utils/helper';

describe('libs/debounce', () => {
  it('should be call once', async () => {
    const callback = jest.fn();
    const fn = debounce(callback, 300);

    times(30, fn);
    await wait(0);
    expect(callback).toHaveBeenCalledTimes(0);

    fn();
    await wait(300);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should be call zero', async () => {
    const callback = jest.fn();
    const fn = debounce(callback, 300);

    times(15, fn);
    await wait();

    expect(callback).toHaveBeenCalledTimes(0);
    fn.cancel();

    await wait(300);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('default time test', async () => {
    const callback = jest.fn();
    const fn = debounce(callback);

    times(30, fn);
    expect(callback).toHaveBeenCalledTimes(0);

    await wait(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
