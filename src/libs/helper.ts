import {
  debounce,
  throttle,
  isObject,
  isFunction,
  isUndefined,
  isArray,
} from 'lodash-es';

const isDef = val => !isUndefined(val) && val !== null;
const isUndef = val => isUndefined(val) || val === null;
const isClient = typeof window !== 'undefined';

export {
  isObject,
  isFunction,
  debounce,
  throttle,
  isDef,
  isUndef,
  isClient,
  isArray,
};
