import {
  ref,
  unref,
  readonly,
  watchEffect,
  getCurrentInstance,
} from 'vue-demi';
import { isFunction } from '@vueposu/shared/utils/helper';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '@vueposu/shared/types/global';

type UseTimeoutReturnType = {
  isActive: Ref<boolean>;
  start: () => void;
  stop: () => void;
};

// TODO: COMMENT NEED
export default function useTimeout(
  callback: () => void,
  timeout: RefTyped<number> = 1000,
  immediate: RefTyped<boolean> = true,
): UseTimeoutReturnType {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useTimeout` can only be called inside of `setup()`.',
    );
  }

  let timer = null;
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

  watchEffect(onInvalidate => {
    unref(immediate) && start();
    onInvalidate(stop);
  });

  return {
    isActive: readonly(isActive),
    start,
    stop,
  };
}
