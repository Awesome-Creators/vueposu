import { onBeforeUnmount, ref } from 'vue-demi';
import { isFunction } from '../libs/helper';
import type { Ref } from 'vue-demi';

interface UseIntervalOptions {
  cb: Function;
  interval?: number;
  immediateStart?: boolean;
}

type UseIntervalReturnType = [Ref<boolean>, () => void, () => void];

// TODO: COMMENT NEED
export default function useInterval(
  options: UseIntervalOptions,
): UseIntervalReturnType {
  const { cb, interval = 1000, immediateStart = true } = options;
  let timer = null;
  let active = ref(immediateStart);

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
      active.value = false;
    }
  };

  const start = () => {
    stop();
    active.value = true;

    timer = setInterval(() => {
      isFunction(cb) && cb();
    }, interval);
  };

  onBeforeUnmount(stop);

  immediateStart && start();

  return [active, start, stop];
}
