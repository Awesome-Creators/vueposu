import { onBeforeUnmount, ref } from 'vue-demi';
import { isFunction } from '../libs/helper';
import type { Ref } from 'vue-demi';

interface UseIntervalOptions {
  cb: Function;
  interval?: number;
  immediateStart?: boolean;
}

type UseIntervalReturnType = {
  isActive: Ref<boolean>;
  start: () => void;
  stop: () => void;
};

// TODO: COMMENT NEED
export default function useInterval(
  options: UseIntervalOptions,
): UseIntervalReturnType {
  const { cb, interval = 1000, immediateStart = true } = options;
  let timer = null;
  let isActive = ref(immediateStart);

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      isActive.value = false;
    }
  };

  const start = () => {
    stop();
    isActive.value = true;

    timer = setInterval(() => {
      isFunction(cb) && cb();
    }, interval);
  };

  onBeforeUnmount(stop);

  immediateStart && start();

  return { isActive, start, stop };
}
