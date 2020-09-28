// wait time
import fakeTimers from '@sinonjs/fake-timers';

const clock = fakeTimers.install();

// wait time
export const wait = (time = 0) => {
  return new Promise(res => {
    setTimeout(res, time)
    clock.tick(time);
  });
};

// exec times
export const times = (times = 0, cb: Function) => {
  for (let i = 0; i < times; i++) {
    cb(i);
  }
};

// trigger dom event
export const triggerDomEvent = evt => {
  document.dispatchEvent(new Event(evt));
};
