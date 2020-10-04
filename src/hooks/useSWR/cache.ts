/* istanbul ignore file */
// TODO: MIT license

// inspired by vercel swr: https://github.com/vercel/swr

import hash from '../../libs/hash';
import { isFunction, isDef } from '../../libs/helper';

import type { SWRKey, CacheListener } from './types';

const cache = new Map();
const listeners: CacheListener[] = [];

const get = (key: SWRKey) => {
  const [_key] = serializeKey(key);
  return cache.get(_key);
};

const set = (key: SWRKey, value: any) => {
  const [_key] = serializeKey(key);
  cache.set(_key, value);
  notify();
};

const del = (key: SWRKey) => {
  const [_key] = serializeKey(key);
  cache.delete(_key);
  notify();
};

const has = (key: SWRKey) => {
  const [_key] = serializeKey(key);
  return cache.has(_key);
};

const clear = () => {
  cache.clear();
  notify();
};

const keys = () => Array.from(cache.keys());

const serializeKey = (
  key: SWRKey,
): [string, any, string, string] => {
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

  const keyError = key ? 'err@' + key : '';
  const keyValidating = key ? 'validating@' + key : '';

  return [key, args, keyError, keyValidating];
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
  listeners.push(listener);

  return () => {
    if (!isSubscribed) return;
    isSubscribed = false;
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
};

// Notify Cache subscribers about a change in the cache.
const notify = () => {
  for (let listener of listeners) {
    listener();
  }
};

export default {
  get,
  set,
  del,
  has,
  clear,
  keys,
  serializeKey,
  subscribe,
};
