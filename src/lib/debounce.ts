interface DebounceOptions {
  wait?: number;
  immediate?: boolean;
}

/**
 * debounce function
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @param immediate Immediately execute the function, default is false
 */

export default function debounce(
  callback = () => {},
  options: DebounceOptions = {},
) {
  const { wait, immediate = false } = options;
  let timeout: any = null;
  return function () {
    const callImmediate = immediate && !timeout;
    const fn = () => callback.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
    callImmediate && fn();
  };
}
