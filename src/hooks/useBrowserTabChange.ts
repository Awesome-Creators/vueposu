import useEffect from './useEffect';
import { isDef, isFunction, isObject } from '@libs/helper';
import type { Ref } from 'vue';
import { ref } from 'vue';

// return type of useBrowserTabChange
type useBrowserTabChangeReturnType = [leave: Ref<boolean>, back: Ref<boolean>];

// the difference platfrom listen
const DIFFERENCE_PLATFORM_EVT = [
  'mozvisibilitychange',
  'webkitvisibilitychange',
  'msvisibilitychange',
  'visibilitychange',
];

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
 * @property `leave` when user leave tab will be `true`, otherwise `false`
 * @property `back` when user back tab will be `true`, otherwise `false`
 */
type useBrowserTabChangeCallbackOptions = {
  leave: boolean;
  back: boolean;
};

/**
 * useBrowserTabChange function
 * @property `options.leave` when user leave tab will be `true`, otherwise `false`
 * @property `options.back` when user back tab will be `true`, otherwise `false`
 */
interface useBrowserTabChangeCallback {
  (options?: useBrowserTabChangeCallbackOptions): useBrowserTabChangeReturnType;
}

/**
 * useBrowserTabChange function
 * when user `leave`/`back` current tab will trigger this hook
 * always execute the last one
 *
 * @param callback function for useBrowserTabChange
 *
 * @callback optons.leave when user leave tab will be `true`, otherwise `false`
 * @callback optons.back when user back tab will be `true`, otherwise `false`
 * @returns `[leave: Ref<boolean>, back: Ref<boolean>]`
 */
export default function useBrowserTabChange(
  callback?: (options: useBrowserTabChangeCallbackOptions) => void,
): useBrowserTabChangeReturnType;

/**
 * useBrowserTabChange function
 * when user `leave/back` current tab will trigger this hook
 * always execute the last one
 *
 * @param options.leave when user leave tab will call it callback function
 * @param options.back when user back tab will call it callback function
 * @returns `[leave: Ref<boolean>, back: Ref<boolean>]`
 */
export default function useBrowserTabChange(
  options?: useBrowserTabChangeOptions,
);

export default function useBrowserTabChange(
  options,
): useBrowserTabChangeReturnType {
  const leave = ref(!document.hidden);
  const back = ref(document.hidden);

  if (isDef(options)) {
    useEffect(() => {
      let listener;

      const getListener = cb => () => {
        setTimeout(() => {
          cb();
          leave.value = document.hidden;
          back.value = !document.hidden;
        }, 0);
      };

      if (isFunction(options)) {
        const $listener = options as useBrowserTabChangeCallback;
        listener = getListener(() =>
          $listener({ leave: document.hidden, back: !document.hidden }),
        );
      } else if (isObject(options)) {
        const $options = options as useBrowserTabChangeOptions;
        listener = getListener(() =>
          document.hidden ? $options?.leave() : $options.back?.(),
        );
      } else {
        listener = getListener(() => {});
      }

      DIFFERENCE_PLATFORM_EVT.forEach(evt => {
        document.addEventListener(evt, listener);
      });

      return () =>
        DIFFERENCE_PLATFORM_EVT.forEach(evt => {
          document.removeEventListener(evt, listener);
        });
    }, []);
  }

  return [leave, back];
}
