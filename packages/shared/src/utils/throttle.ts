import { throttle as $throttle } from 'lodash-es';

import type { Fn } from '../';

export interface ThrottleFn<T extends (...args: any[]) => any> {
  /**
   * Call the original function, but applying the debounce rules.
   *
   * If the throttle function can be run immediately, this calls it and returns its return
   * value.
   *
   * Otherwise, it returns the return value of the last invokation, or undefined if the throttle
   * function was not invoked yet.
   */
  (...args: Parameters<T>): ReturnType<T> | undefined;

  /**
   * Throw away any pending invokation of the throttle function.
   */
  cancel(): void;
}

/**
 * throttle function
 * @param callback The function or a promise to throttle.
 * @param wait The number of milliseconds to delay.
 * @returns throttled function
 * @returns throttled.cancel function
 */
export function throttle<T extends Fn>(
  callback: T,
  wait = 0,
): ThrottleFn<T> {
  return $throttle(callback, wait);
}
