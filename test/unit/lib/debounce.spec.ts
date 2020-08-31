import debounce from '@lib/debounce';

describe('debounce', () => {
  it('should be call once', () => {
    jest.useFakeTimers();
    const callback = jest.fn();

    const fn = debounce(callback, { wait: 200 });

    fn();
    fn();
    fn();
    fn();
    fn();
    fn();
    fn();

    expect(setTimeout).toHaveBeenCalledTimes(7);

    const callback2 = jest.fn();
    const fn2 = debounce(callback2);

    fn2();
    fn2();
    fn2();
    fn2();
    fn2();
    fn2();
    fn2();

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledTimes(1);
    }, 1000);
  });

  it('shold be call immediate', () => {
    jest.useFakeTimers();

    const callback = jest.fn();
    const fn = debounce(callback, { wait: 200, immediate: true });

    fn();
    fn();
    fn();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
