import Emitter from '../emitter';

describe('utils/emitter', () => {
  it('on', () => {
    const emitter = new Emitter();
    emitter.on('hello', jest.fn());
    emitter.on('hello', jest.fn());
    expect(emitter.events['hello'].length).toEqual(2);
  });
  it('off', () => {
    const emitter = new Emitter();
    const handler = jest.fn();
    emitter.on('hello', handler);
    expect(emitter.events['hello'].length).toEqual(1);
    emitter.off('hello', handler);
    expect(emitter.events['hello'].length).toEqual(0);
  });
  it('emit', () => {
    const emitter = new Emitter();
    const handler = jest.fn();
    emitter.on('hello', handler);
    emitter.emit('hello', 'hello world');
    emitter.emit('hello', 'hello shit');
    const [[[first]], [[second]]] = handler.mock.calls;
    expect(first).toBe('hello world');
    expect(second).toBe('hello shit');
  });
});
