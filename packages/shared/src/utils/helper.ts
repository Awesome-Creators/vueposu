import {
  isObject,
  isFunction,
  isUndefined,
  isArray,
  isEqual,
} from 'lodash-es';

const isDef = val => !isUndefined(val) && val !== null;
const isUndef = val => isUndefined(val) || val === null;
const isServer = typeof window === 'undefined' || typeof document === 'undefined';

export {
  isObject,
  isFunction,
  isUndefined,
  isDef,
  isUndef,
  isArray,
  isEqual,
  isServer,
};
