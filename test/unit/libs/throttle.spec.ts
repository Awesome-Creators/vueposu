import throttle from '@libs/throttle';

describe('throttle', () => {
  it('should be call once', done => {
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

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(2);
      done();
    }, 310);
  });

  it('should be call zero', done => {
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
    fn.cancel();

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1);
      done();
    }, 310);
  });

  it('default time test', done => {
    const callback = jest.fn();
    const fn = throttle(callback);

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

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(2);
      done();
    }, 210);
  });
});
