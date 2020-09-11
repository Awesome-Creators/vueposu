import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';

import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';
import isUndefined from 'lodash.isundefined';

const isDef = val => !isUndefined(val) && val !== null;
const isUndef = val => isUndefined(val) || val === null;

export { isObject, isFunction, debounce, throttle, isDef, isUndef };
