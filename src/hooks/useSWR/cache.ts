// TODO: MIT license

// inspired by vercel swr: https://github.com/vercel/swr

import hash from '../../libs/hash';
import { isFunction } from '../../libs/helper';

import type { SWRKey, CacheListener } from './types';

const cache = new Map();
const listeners: CacheListener[] = [];

const get = ($key: SWRKey) => {
  const [key] = serializeKey($key);
  return cache.get(key);
};

const set = ($key: SWRKey, value: any) => {
  const [key] = serializeKey($key);
  cache.set(key, value);
  notify();
};

const del = ($key: SWRKey) => {
  const [key] = serializeKey($key);
  cache.delete(key);
  notify();
};

const has = ($key: SWRKey) => {
  const [key] = serializeKey($key);
  return cache.has(key);
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
};
