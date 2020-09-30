import {
  debounce,
  throttle,
  isObject,
  isFunction,
  isUndefined,
  isArray,
  isEqual,
} from 'lodash-es';

const isDef = val => !isUndefined(val) && val !== null;
const isUndef = val => isUndefined(val) || val === null;
const isClient = !isUndefined(typeof window);

export {
  debounce,
  throttle,
  isObject,
  isFunction,
  isUndefined,
  isDef,
  isUndef,
  isClient,
  isArray,
  isEqual,
};
