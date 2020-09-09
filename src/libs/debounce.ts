import $debounce from 'lodash.debounce';

/**
 * Debounce function
 * @param callback The function or a promise to debounce.
 * @param wait The number of milliseconds to delay.
 * @param immediate Immediately execute the function, default is false
 * @returns debounced function
 * @returns debounced.cancel function
 * @returns debounced.run function
 */
export default function debounce<T extends (...args: any) => any>(
  callback: T,
  wait = 200,
) {
  const debounced = $debounce(callback, wait);
  return debounced;
}
