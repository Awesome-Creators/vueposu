import { ref, unref, readonly, watchEffect } from "vue-demi";
import { isFunction } from "@vueposu/utils";

import type { Ref } from "vue-demi";
import type { RefTyped } from "@vueposu/utils";

type UseTimeoutReturnType = {
  isActive: Ref<boolean>;
  start: () => void;
  stop: () => void;
};

// TODO: COMMENT NEED
export function useTimeout(
  callback: () => void,
  timeout: RefTyped<number> = 1000,
  immediate: RefTyped<boolean> = true
): UseTimeoutReturnType {
  let timer: NodeJS.Timeout | null = null;
  const isActive = ref(immediate);

  const stop = () => {
    isActive.value = false;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    isActive.value = true;
    timer = setTimeout(() => {
      isFunction(callback) && callback();
      isActive.value = false;
    }, unref(timeout));
  };

  watchEffect((onInvalidate) => {
    unref(immediate) && start();
    onInvalidate(stop);
  });

  return {
    isActive: readonly(isActive),
    start,
    stop,
  };
}
