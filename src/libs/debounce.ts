import { debounce as $debounce } from './helper';

// debounce function type
export type Fn = (...args: any) => any;

export interface DebouncedFunc<T extends (...args: any[]) => any> {
  /**
   * Call the original function, but applying the debounce rules.
   *
   * If the debounced function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invokation, or undefined if the debounced
   * function was not invoked yet.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /**
   * Throw away any pending invokation of the debounced function.
   */
  cancel(): void;
}

/**
 * Debounce function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 * @returns debounced function
 * @returns debounced.cancel function
 */
export default function debounce<T extends Fn>(
  callback: T,
  wait = 0,
): DebouncedFunc<T> {
  const debounced = $debounce(callback, wait);

  return debounced;
}
