// TODO: MIT license

// inspired by vercel swr: https://github.com/vercel/swr

import { ref, unref, getCurrentInstance } from 'vue-demi';
import defaultConfig, { cache } from './config';
import isDocumentVisible from '../../libs/isDocumentVisible';
import isOnline from '../../libs/isOnline';
import { isFunction, isObject, isUndefined } from '../../libs/helper';

import type {
  ActionType,
  Fetcher,
  KeyInterface,
  ConfigInterface,
  UseSWRReturnType,
} from './types';

const IS_SERVER = isUndefined(window);

// polyfill for requestIdleCallback
const rIC = IS_SERVER
  ? null
  : window['requestIdleCallback'] || (f => setTimeout(f, 1));

// global state managers
const FOCUS_REVALIDATORS = {};
const RECONNECT_REVALIDATORS = {};

// setup DOM events listeners for `focus` and `reconnect` actions
if (!IS_SERVER && window.addEventListener) {
  const revalidate = revalidators => {
    if (!isDocumentVisible() || !isOnline()) return;

    for (const key in revalidators) {
      if (revalidators[key][0]) revalidators[key][0]();
    }
  };

  // focus revalidate
  window.addEventListener(
    'visibilitychange',
    () => revalidate(FOCUS_REVALIDATORS),
    false,
  );
  window.addEventListener('focus', () => revalidate(FOCUS_REVALIDATORS), false);
  // reconnect revalidate
  window.addEventListener(
    'online',
    () => revalidate(RECONNECT_REVALIDATORS),
    false,
  );
}

function useSWR<D = any, E = any>(key: KeyInterface): UseSWRReturnType<D, E>;

function useSWR<D = any, E = any>(
  key: KeyInterface,
  config?: ConfigInterface<D, E>,
): UseSWRReturnType<D, E>;

function useSWR<D = any, E = any>(
  key: KeyInterface,
  fetcher?: Fetcher<D>,
  config?: ConfigInterface<D, E>,
): UseSWRReturnType<D, E>;

// WIP
function useSWR<D = any, E = any>(...args): UseSWRReturnType<D, E> {
  if (getCurrentInstance()) {
    let _key: KeyInterface,
      fetcher: Fetcher<D> | undefined,
      config: ConfigInterface<D, E> = {};

    if (args.length >= 1) {
      _key = unref(args[0]);
    }
    if (args.length > 2) {
      if (isFunction(args[1])) {
        fetcher = args[1];
      }
      if (isObject(args[2])) {
        config = args[2];
      }
    } else {
      if (isFunction(args[1])) {
        fetcher = args[1];
      } else if (isObject(args[1])) {
        config = args[1];
      }
    }

    // if `key` is the identifier of the request,
    // `key` can be changed but fetcher cant,
    // `errKey` is the cache key for error objects
    const [key, fetcherArgs, errKey, validatingKey] = cache.serializeKey(_key);

    config = {
      ...defaultConfig.value,
      ...config,
    };

    if (isUndefined(fetcher)) {
      fetcher = config.fetcher;
    }

    const resolveData = () => {
      const cachedData = cache.get(key);
      return isUndefined(cachedData) ? config.initialData : cachedData;
    };

    const data = ref(resolveData());
  } else {
    throw new Error(
      'Invalid hook call: `useSWR` can only be called inside of `setup()`.',
    );
  }
}

export default useSWR;
