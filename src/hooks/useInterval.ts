import {
  ref,
  unref,
  readonly,
  watchEffect,
  getCurrentInstance,
} from 'vue-demi';
import { isFunction } from '../libs/helper';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

type UseIntervalReturnType = {
  isActive: Ref<boolean>;
  start: () => void;
  stop: () => void;
};

// TODO: COMMENT NEED
export default function useInterval(
  callback: () => void,
  interval: RefTyped<number> = 1000,
  immediate: RefTyped<boolean> = true,
): UseIntervalReturnType {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useInterval` can only be called inside of `setup()`.',
    );
  }

  let timer = null;
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
