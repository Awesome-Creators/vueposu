import { ref, unref, readonly, watch, getCurrentInstance } from 'vue-demi';
import { throttle, isFunction } from '@vueposu/shared';

import type { RefTyped, Fn } from '@vueposu/shared';

/**
 * useThrottleFn function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 *
 * @returns throttled function
 * @returns throttled.cancel function
 * @returns throttled.flush function
 */
export function useThrottleFn<T extends Fn>(callback: T, wait: RefTyped<number> = 0) {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useThrottleFn` can only be called inside of `setup()`.',
    );
  }

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