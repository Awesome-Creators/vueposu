/* istanbul ignore file */
// TODO: MIT license

// inspired by vercel swr: https://github.com/vercel/swr

import { CacheInterface, KeyInterface, CacheListener } from './types';
import hash from '../../libs/hash';
import { isFunction, isDef } from '../../libs/helper';

export default class Cache implements CacheInterface {
  private $cache: Map<string, any>;
  private $listeners: CacheListener[] = [];

  constructor(initialData: any = {}) {
    this.$cache = new Map(Object.entries(initialData));
  }

  get(key: KeyInterface): any {
    const [_key] = this.serializeKey(key);
    return this.$cache.get(_key);
  }

  set(key: KeyInterface, value: any): any {
    const [_key] = this.serializeKey(key);
    this.$cache.set(_key, value);
    this.notify();
  }

  keys() {
    return Array.from(this.$cache.keys());
  }

  has(key: KeyInterface) {
    const [_key] = this.serializeKey(key);
    return this.$cache.has(_key);
  }

  clear() {
    this.$cache.clear();
    this.notify();
  }

  delete(key: KeyInterface) {
    const [_key] = this.serializeKey(key);
    this.$cache.delete(_key);
    this.notify();
  }

  serializeKey(key: KeyInterface): [string, any, string, string] {
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
    const isValidatingKey = key ? 'validating@' + key : ''

    return [key, args, errorKey, isValidatingKey];
  }

  subscribe(listener: CacheListener) {
    if (!isFunction(listener)) {
      throw new Error(
        `Invalid assignment: expected the listener to be a function but got: ${
          isDef(listener) ? typeof listener : listener
        }`,
      );
    }

    let isSubscribed = true;
    this.$listeners.push(listener);

    return () => {
      if (!isSubscribed) return;
      isSubscribed = false;
      const index = this.$listeners.indexOf(listener);
      if (index > -1) {
        this.$listeners[index] = this.$listeners[this.$listeners.length - 1];
        this.$listeners.length--;
      }
    };
  }

  // Notify Cache subscribers about a change in the cache.
  private notify() {
    for (let listener of this.$listeners) {
      listener();
    }
  }
}
