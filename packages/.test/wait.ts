import fakeTimers from '@sinonjs/fake-timers';

const clock = fakeTimers.install();

// wait time
export const wait = (time = 0) =>
  new Promise(res => {
    setTimeout(res, time);
    clock.tick(time);
  });