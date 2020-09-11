import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import isUndef from 'lodash.isundefined';

const isDef = val => !isUndef(val);

const isOneOfPropertyDef = (object, properties: string[]) => {
  return properties.some(property => isDef(object[property]));
};

export { isObject, isFunction, debounce, throttle, isDef, isOneOfPropertyDef };
