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

type UseTimeoutReturnType = {
  isActive: Ref<boolean>;
  start: () => void;
  stop: () => void;
};

// TODO: COMMENT NEED
export default function useTimeout(
  callback: () => void,
  timeout: RefTyped<number> = 1000,
  immediateStart: RefTyped<boolean> = true,
): UseTimeoutReturnType {
  if (getCurrentInstance()) {
    let timer = null;
    const isActive = ref(immediateStart);

    const stop = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        isActive.value = false;
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
      unref(immediateStart) && start();

      onInvalidate(stop);
    });

    return {
      isActive: readonly(isActive),
      start,
      stop,
    };
  } else {
    throw new Error(
      'Invalid hook call: `useTimeout` can only be called inside of `setup()`.',
    );
  }
}
