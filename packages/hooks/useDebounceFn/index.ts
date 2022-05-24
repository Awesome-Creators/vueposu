import { ref, unref, readonly, watch } from "vue-demi";
import { isFunction } from "@vueposu/utils";
import { debounce } from "lodash-es";

import type { RefTyped, Fn } from "@vueposu/utils";
import type { DebouncedFunc } from "lodash-es";

/**
 * useDebounceFn function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 *
 * @returns debounced ref function
 * @returns debounced.value.cancel function
 * @returns debounced.value.flush function
 */
export function useDebounceFn<T extends Fn>(
  callback: T,
  wait: RefTyped<number> = 0
) {
  const debounced = ref((() => {}) as DebouncedFunc<T>);
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
    }
  );

  return readonly(debounced);
}
