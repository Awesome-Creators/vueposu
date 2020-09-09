import $throttle from 'lodash.throttle';

/**
 * throttle function
 * @param callback The function or a promise to throttle.
 * @param wait The number of milliseconds to delay.
 * @param immediate Immediately execute the function, default is false
 * @returns throttled function
 * @returns throttled.cancel function
 * @returns throttled.run function
 */
export default function throttle<T extends (...args: any) => any>(
  callback: T,
  wait = 200,
) {
  const throttled = $throttle(callback, wait);
  return throttled;
}
