import { debounce } from 'lodash-es';
import { throttle } from 'lodash-es';

import { isObject } from 'lodash-es';
import { isFunction } from 'lodash-es';
import { isUndefined } from 'lodash-es';

const isDef = val => !isUndefined(val) && val !== null;
const isUndef = val => isUndefined(val) || val === null;

export { isObject, isFunction, debounce, throttle, isDef, isUndef };
