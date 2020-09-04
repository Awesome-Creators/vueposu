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
  return function () {
    const callImmediate = immediate && !timeout;
    const fn = () => callback?.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
    callImmediate && fn();
  };
}
