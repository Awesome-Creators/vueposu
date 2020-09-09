/**
 * Debounce function
 * @param callback The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @param immediate Immediately execute the function, default is false
 * @returns debounce function
 */
export default function debounce(
  callback: Function,
  wait = 200,
  immediate = false,
) {
  let timeout: any = null;

  const useRAF =
    !wait && wait !== 0 && typeof window.requestAnimationFrame === 'function';

  const startTimer = (pendingFunc, wait) => {
    if (useRAF) {
      return window.requestAnimationFrame(pendingFunc);
    }
    return setTimeout(pendingFunc, wait);
  };

  const cancelTimer = () => {
    if (useRAF) {
      return window.cancelAnimationFrame(timeout);
    }
    clearTimeout();
  };

  const cancel = () => {
    timeout !== undefined && cancelTimer();
  };

  const fn = function () {
    const callImmediate = immediate && !timeout;
    const fn = () => callback?.apply(this, arguments);
    if (wait === 0) {
      fn();
    } else {
      cancelTimer();
      timeout = startTimer(fn, wait);
      callImmediate && fn();
    }
  };

  fn.cancel = cancel;

  return fn;
}
