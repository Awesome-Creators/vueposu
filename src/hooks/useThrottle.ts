import throttle from '../libs/throttle';
import type { Fn } from '../libs/throttle';

/**
 * useDebounce function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 * @returns throttled function
 * @returns throttled.cancel function
 * @returns throttled.flush function
 */
function useThrottle<T extends Fn>(callback: T, wait = 0) {
  const throttled = throttle(callback, wait);
  return throttled;
}

export default useThrottle;
