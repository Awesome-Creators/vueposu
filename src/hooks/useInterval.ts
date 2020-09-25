import { onBeforeUnmount } from 'vue-demi';

interface useIntervalOptions {
  cb: Function;
  interval?: number;
  immediateStart?: boolean;
}

// TODO: COMMENT NEED
export default function useInterval(options: useIntervalOptions) {
  let timer = null;
  const { cb = () => {}, interval = 1000, immediateStart = true } = options;

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    timer = setInterval(() => {
      cb();
    }, interval);
  };

  onBeforeUnmount(stop);

  immediateStart && start();

  return [start, stop];
}
