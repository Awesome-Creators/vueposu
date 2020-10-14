import { onBeforeUnmount, ref, readonly } from 'vue-demi';
import { isFunction } from '../libs/helper';
import type { Ref } from 'vue-demi';

type UseTimeoutReturnType = {
  isActive: Ref<boolean>;
  start: () => void;
  stop: () => void;
};

// TODO: COMMENT NEED
export default function useTimeout(
  callback: () => void,
  timeout: number = 0,
  immediateStart: boolean = true,
): UseTimeoutReturnType {
  let timer = null;
  let isActive = ref(immediateStart);

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
    }, timeout);
  };

  immediateStart && start();

  onBeforeUnmount(stop);

  return {
    isActive: readonly(isActive),
    start,
    stop,
  };
}
