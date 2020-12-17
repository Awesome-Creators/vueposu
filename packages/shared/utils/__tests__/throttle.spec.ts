import throttle from '../throttle';
import { times, wait } from '../helper';

describe('libs/throttle', () => {
  it('should be call once', async () => {
    const callback = jest.fn();
    const fn = throttle(callback, 300);

    fn();
    expect(callback).toHaveBeenCalledTimes(1);

    fn();
    await wait(150);
    fn();
    await wait(150);
    expect(callback).toHaveBeenCalledTimes(2);

    fn();
    await wait(280);
    fn();
    await wait(20);
    expect(callback).toHaveBeenCalledTimes(3);

    fn();
    await wait(280);
    fn();
    await wait(320);
    fn();
    await wait();
    expect(callback).toHaveBeenCalledTimes(5);
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
    expect(callback).toHaveBeenCalledTimes(1);

    fn();
    await wait(0);
    fn();
    await wait(0);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});
