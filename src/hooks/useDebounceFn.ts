import { ref, unref, readonly, watch } from 'vue-demi';
import debounce from '../libs/debounce';
import { isFunction } from '../libs/helper';

import type { Fn } from '../libs/debounce';
import type { RefTyped } from '../types/global';

/**
 * useDebounceFn function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 *
 * @returns debounced ref function
 * @returns debounced.value.cancel function
 * @returns debounced.value.flush function
 */
function useDebounceFn<T extends Fn>(callback: T, wait: RefTyped<number> = 0) {
  const debounced = ref((() => {}) as any);
  const $wait = ref(wait);

  watch(
    $wait,
    () => {
      if (isFunction(debounced.value.cancel)) {
        debounced.value.cancel();
      }
      debounced.value = debounce(callback, unref(wait));
    },
    {
      immediate: true,
    },
  );

  return readonly(debounced);
}

export default useDebounceFn;
