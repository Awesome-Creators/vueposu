import { Emitter } from ".";

describe('utils/emitter', () => {
  it('on', () => {
    const emitter = new Emitter();
    emitter.on('hello', vi.fn());
    emitter.on('hello', vi.fn());
    expect(emitter.events['hello'].length).toEqual(2);
  });

  it('off', () => {
    const emitter = new Emitter();
    const handler = vi.fn();
    emitter.on('hello', handler);
    expect(emitter.events['hello'].length).toEqual(1);
    emitter.off('hello', handler);
    expect(emitter.events['hello'].length).toEqual(0);
  });
  it('emit', () => {
    const emitter = new Emitter();
    const handler = vi.fn();
    emitter.on('hello', handler);
    emitter.emit('hello', 'world');
    emitter.emit('hello', 'boy next door');
    const [[[first]], [[second]]] = handler.mock.calls;
    expect(first).toBe('world');
    expect(second).toBe('boy next door');
  });
});
