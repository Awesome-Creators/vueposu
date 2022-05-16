import { ref, unref, readonly, watchEffect } from "vue-demi";
import { isFunction } from "@vueposu/utils";

import type { Ref } from "vue-demi";
import type { RefTyped } from "@vueposu/utils";

type UseIntervalReturnType = {
  isActive: Ref<boolean>;
  start: () => void;
  stop: () => void;
};

// TODO: COMMENT NEED
export function useInterval(
  callback: () => void,
  interval: RefTyped<number> = 1000,
  immediate: RefTyped<boolean> = true
): UseIntervalReturnType {
  let timer: NodeJS.Timeout | null = null;
  const isActive = ref(immediate);

  const stop = () => {
    isActive.value = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    isActive.value = true;
    timer = setInterval(() => {
      isFunction(callback) && callback();
    }, unref(interval));
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
