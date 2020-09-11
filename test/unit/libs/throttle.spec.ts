import throttle from '@libs/throttle';
import { times, wait } from '../../utils/helper';

describe('libs/throttle', () => {
  it('should be call once', async () => {
    const callback = jest.fn();
    const fn = throttle(callback, 300);

    fn();
    expect(callback).toHaveBeenCalledTimes(1);

    fn();
    expect(callback).toHaveBeenCalledTimes(1);

    fn();
    expect(callback).toHaveBeenCalledTimes(1);

    fn();
    expect(callback).toHaveBeenCalledTimes(1);

    fn();
    expect(callback).toHaveBeenCalledTimes(1);

    await wait(310);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should be call zero', async () => {
    const callback = jest.fn();
    const fn = throttle(callback, 300);

    times(10, fn);
    expect(callback).toHaveBeenCalledTimes(1);

    fn.cancel();
    await wait(310);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('default time test', async () => {
    const callback = jest.fn();
    const fn = throttle(callback);

    fn();
    await wait();
    expect(callback).toHaveBeenCalledTimes(1);

    times(10, fn);
    await wait();
    expect(callback).toHaveBeenCalledTimes(11);
  });
});
