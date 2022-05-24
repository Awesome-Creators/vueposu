import { ref, unref, readonly, watch } from "vue-demi";
import { isFunction } from "@vueposu/utils";
import { throttle } from "lodash-es";

import type { DebouncedFunc } from "lodash-es";
import type { RefTyped, Fn } from "@vueposu/utils";

/**
 * useThrottleFn function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 *
 * @returns throttled function
 * @returns throttled.cancel function
 * @returns throttled.flush function
 */
export function useThrottleFn<T extends Fn>(
  callback: T,
  wait: RefTyped<number> = 0
) {
  const throttled = ref((() => {}) as DebouncedFunc<T>);
  const $wait = ref(wait);

  watch(
    $wait,
    () => {
      if (isFunction(throttled.value?.cancel)) {
        throttled.value.cancel();
      }
      throttled.value = throttle(callback, unref(wait));
    },
    {
      immediate: true,
    }
  );

  return readonly(throttled);
}
