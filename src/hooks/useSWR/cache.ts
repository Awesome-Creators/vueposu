/* istanbul ignore file */
// TODO: MIT license

// inspired by vercel swr: https://github.com/vercel/swr

import { KeyInterface, CacheListener } from './types';
import hash from '../../libs/hash';
import { isFunction, isDef } from '../../libs/helper';

const $cache = new Map();
const $listeners: CacheListener[] = [];

const get = (key: KeyInterface) => {
  const [_key] = serializeKey(key);
  return $cache.get(_key);
};

const set = (key: KeyInterface, value: any) => {
  const [_key] = serializeKey(key);
  $cache.set(_key, value);
  notify();
};

const del = (key: KeyInterface) => {
  const [_key] = serializeKey(key);
  $cache.delete(_key);
  notify();
};

const has = (key: KeyInterface) => {
  const [_key] = serializeKey(key);
  return $cache.has(_key);
};

const clear = () => {
  $cache.clear();
  notify();
};

const keys = () => Array.from($cache.keys());

const serializeKey = (key: KeyInterface): [string, any, string, string] => {
  let args = null;
  if (isFunction(key)) {
    try {
      key = key();
    } catch (err) {
      // dependencies not ready.
      key = '';
    }
  }

  if (Array.isArray(key)) {
    // args array
    args = key;
    key = hash(key);
  } else {
    // convert null to ''
    key = String(key || '');
  }

  const errorKey = key ? 'err@' + key : '';
  const isValidatingKey = key ? 'validating@' + key : '';

  return [key, args, errorKey, isValidatingKey];
};

const subscribe = (listener: CacheListener) => {
  if (!isFunction(listener)) {
    throw new Error(
      `Invalid assignment: expected the listener to be a function but got: ${
        isDef(listener) ? typeof listener : listener
      }`,
    );
  }

  let isSubscribed = true;
  $listeners.push(listener);

  return () => {
    if (!isSubscribed) return;
    isSubscribed = false;
    const index = $listeners.indexOf(listener);
    if (index > -1) {
      $listeners[index] = $listeners[$listeners.length - 1];
      $listeners.length--;
    }
  };
};

// Notify Cache subscribers about a change in the cache.
const notify = () => {
  for (let listener of $listeners) {
    listener();
  }
};

export default {
  $cache,
  $listeners,
  get,
  set,
  del,
  has,
  clear,
  keys,
  serializeKey,
  subscribe,
};
