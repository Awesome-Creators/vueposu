// wait time
import fakeTimers from '@sinonjs/fake-timers';

// trigger dom event
export const triggerDomEvent = (
  evt,
  elm: Window | Document | HTMLElement = document,
) => {
  const $elm = elm ?? document;
  $elm.dispatchEvent(new Event(evt));
};

const clock = fakeTimers.install();

// wait time
export const wait = (time = 0) =>
  new Promise(res => {
    setTimeout(res, time);
    clock.tick(time);
  });

// exec times
export const times = (times = 0, cb: Function) => {
  for (let i = 0; i < times; i++) {
    cb(i);
  }
};