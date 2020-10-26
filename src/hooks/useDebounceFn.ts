import { unref } from 'vue-demi';
import debounce from '../libs/debounce';

import type { Fn } from '../libs/debounce';
import type { RefTyped } from '../types/global';

/**
 * useDebounceFn function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 * @returns debounced function
 * @returns debounced.cancel function
 * @returns debounced.flush function
 */
function useDebounceFn<T extends Fn>(callback: T, wait: RefTyped<number> = 0) {
  const debounced = debounce(callback, unref(wait));
  return debounced;
}

export default useDebounceFn;
