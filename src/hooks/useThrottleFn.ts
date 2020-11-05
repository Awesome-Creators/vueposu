import { ref, unref, readonly, watch } from 'vue-demi';
import throttle from '../libs/throttle';
import { isFunction } from '../libs/helper';

import type { Fn } from '../libs/throttle';
import type { RefTyped } from '../types/global';

/**
 * useThrottleFn function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 *
 * @returns throttled function
 * @returns throttled.cancel function
 * @returns throttled.flush function
 */
function useThrottleFn<T extends Fn>(callback: T, wait: RefTyped<number> = 0) {
  const throttled = ref((() => {}) as any);
  const $wait = ref(wait);

  watch(
    $wait,
    () => {
      if (isFunction(throttled.value.cancel)) {
        throttled.value.cancel();
      }
      throttled.value = throttle(callback, unref(wait));
    },
    {
      immediate: true,
    },
  );

  return readonly(throttled);
}

export default useThrottleFn;
