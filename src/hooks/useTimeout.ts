import { onBeforeUnmount, ref } from 'vue-demi';

interface useTimeoutOptions {
  cb: Function;
  timeout?: number;
  immediateStart?: boolean;
}

// TODO: COMMENT NEED
export default function useTimeout(options: useTimeoutOptions) {
  const { cb = () => {}, timeout = 1000, immediateStart = true } = options;
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
      cb();
      active.value = false;
    }, timeout);
  };

  immediateStart && start();

  onBeforeUnmount(stop);

  return [active, start, stop];
}
