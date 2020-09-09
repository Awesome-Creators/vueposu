import debounce from '@libs/debounce';

describe('debounce', () => {
  it('should be call once', done => {
    const callback = jest.fn();
    const fn = debounce(callback, 300);

    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1);
      done();
    }, 310);
  });

  it('should be call zero', done => {
    const callback = jest.fn();
    const fn = debounce(callback, 300);

    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn.cancel();

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(0);
      done();
    }, 310);
  });

  it('default time test', done => {
    const callback = jest.fn();
    const fn = debounce(callback);

    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);
    fn();
    expect(callback).toHaveBeenCalledTimes(0);

    setTimeout(() => {
      expect(callback).toHaveBeenCalledTimes(1);
      done();
    }, 210);
  });
});
