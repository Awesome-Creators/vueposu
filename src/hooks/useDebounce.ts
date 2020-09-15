import debounce from '../libs/debounce';
import type { Fn } from '../libs/debounce';

/**
 * useDebounce function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 * @returns debounced function
 * @returns debounced.cancel function
 * @returns debounced.flush function
 */
function useDebounce<T extends Fn>(callback: T, wait = 0) {
  const debounced = debounce(callback, wait);
  return debounced;
}

export default useDebounce;
