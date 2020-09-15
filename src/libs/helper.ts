import {
  debounce,
  throttle,
  isObject,
  isFunction,
  isUndefined,
} from 'lodash-es';

const isDef = val => !isUndefined(val) && val !== null;
const isUndef = val => isUndefined(val) || val === null;

export { isObject, isFunction, debounce, throttle, isDef, isUndef };
