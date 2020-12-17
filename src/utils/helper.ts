import {
  debounce,
  throttle,
  isObject,
  isFunction,
  isUndefined,
  isArray,
  isEqual,
} from 'lodash-es';

// wait time
import fakeTimers from '@sinonjs/fake-timers';

const isDef = val => !isUndefined(val) && val !== null;
const isUndef = val => isUndefined(val) || val === null;
const isServer = typeof window === 'undefined' || typeof document === 'undefined';

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

export {
  debounce,
  throttle,
  isObject,
  isFunction,
  isUndefined,
  isDef,
  isUndef,
  isArray,
  isEqual,
  isServer,
};
