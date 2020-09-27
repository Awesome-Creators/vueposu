import { onBeforeUnmount, ref } from 'vue-demi';
import { isFunction } from '../libs/helper';
import type { Ref } from 'vue-demi';

interface useTimeoutOptions {
  cb: Function;
  timeout?: number;
  immediateStart?: boolean;
}

type useTimeoutRet = [Ref<boolean>, () => void, () => void];

// TODO: COMMENT NEED
export default function useTimeout(options: useTimeoutOptions): useTimeoutRet {
  const { cb, timeout = 1000, immediateStart = true } = options;
  let timer = null;
  let active = ref(immediateStart);

  const stop = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      active.value = false;
    }
  };

  const start = () => {
    stop();
    active.value = true;
    timer = setTimeout(() => {
      isFunction(cb) && cb();
      active.value = false;
    }, timeout);
  };

  immediateStart && start();

  onBeforeUnmount(stop);

  return [active, start, stop];
}
