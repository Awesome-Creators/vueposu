import useEffect from './useEffect';
import isObject from 'lodash.isobject';
import isFunction from 'lodash.isfunction';

/**
 * useBrowserTabChange function options define
 * @property `leave` when user leave tab will call it callback function
 * @property `back` when user back tab will call it callback function
 */
interface useBrowserTabChangeOptions {
  leave?: Function;
  back?: Function;
}

/**
 * useBrowserTabChange function options define
 * @property `leave` when user leave tab will be true, otherwise false
 * @property `back` when user back tab will be true, otherwise false
 */
interface useBrowserTabChangeCallback {
  (options: { leave: boolean; back: boolean }): void;
}

/**
 * useBrowserTabChangeCallback
 * callback function for useBrowserTabChange

 * @callback boolean `optons.leave`  when user leave tab will be true, otherwise false
 * @callback boolean `optons.back`  when user back tab will be true, otherwise false
 */
const useBrowserTabChangeCallback = () =>
  // options: useBrowserTabChangeCallbackOptions,
  {
    return () => {
      // callback(document.hidden)
    };
  };

/**
 * useBrowserTabChange function
 * when user `leave`/`back` current tab will trigger this hook
 * always execute the last one
 *
 * @param callback function for useBrowserTabChange
 *
 * @callback optons.leave when user leave tab will be true, otherwise false
 * @callback optons.back when user back tab will be true, otherwise false
 * @returns void
 */
export default function useBrowserTabChange(
  callback: useBrowserTabChangeCallback,
): void;

/**
 * useBrowserTabChange function
 * when user leave/back current tab will trigger this hook
 * always execute the last one
 *
 * @param `options.leave` when user leave tab will call it callback function
 * @param `options.back` when user back tab will call it callback function
 * @returns void
 */
export default function useBrowserTabChange(
  options: useBrowserTabChangeOptions,
);

export default function useBrowserTabChange(options): void {
  useEffect(() => {
    let listener;
    let shouldListen = false;

    if (isObject(options)) {
      const $options = options as useBrowserTabChangeOptions;
      if ($options.back || $options.leave) {
        shouldListen = true;
        listener = () => {
          document.hidden ? $options?.leave() : $options.back?.();
        };
      }
    } else if (isFunction(options)) {
      const $listener = listener as useBrowserTabChangeCallback;
      $listener({ leave: document.hidden, back: !document.hidden });
    }

    shouldListen && document.addEventListener('visibilitychange', listener);

    return () =>
      shouldListen &&
      document.removeEventListener('visibilitychange', listener);
  });
}
