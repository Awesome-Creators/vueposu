import { onUnmounted } from 'vue-demi';

// TODO: COMMENT NEED
export default function useInterval(
  cb: Function,
  interval = 1000,
  immediateStart = true,
) {
  let timer = null;

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  const start = () => {
    stop();
    timer = setInterval(cb, interval);
  };

  immediateStart && start();

  onUnmounted(stop);

  return [start, stop];
}
