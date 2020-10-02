// TODO: MIT license

// inspired by vercel swr: https://github.com/vercel/swr
// learn at: https://github.com/chenbin92/swr-source-code

import { reactive, unref, watchEffect, toRefs, getCurrentInstance } from 'vue-demi';
import cache from './cache';
import defaultConfig from './config';
import isDocumentVisible from '../../libs/isDocumentVisible';
import isOnline from '../../libs/isOnline';
import {
  isFunction,
  isObject,
  isUndefined,
  isDef,
  isEqual,
} from '../../libs/helper';

import type {
  ActionType,
  Fetcher,
  KeyInterface,
  ConfigInterface,
  UseSWRReturnType,
  BroadcastStateInterface,
} from './types';

const isServer = isUndefined(window);

// polyfill for requestIdleCallback
const rIC = isServer
  ? null
  : window['requestIdleCallback'] || (f => setTimeout(f, 1));

// global state managers
const concurrentPromises = {};
const concurrentPromisesTS = {};
const focusRevalidators = {};
const reconnectRevalidators = {};
const cacheRevalidators = {};

// mutation timestamps
const mutationTS = {};
const mutationEndTS = {};

// setup DOM events listeners for `focus` and `reconnect` actions
if (!isServer && window.addEventListener) {
  const revalidate = revalidators => {
    if (!isDocumentVisible() || !isOnline()) return;

    for (const key in revalidators) {
      if (revalidators[key][0]) revalidators[key][0]();
    }
  };

  // focus revalidate
  window.addEventListener(
    'visibilitychange',
    () => revalidate(focusRevalidators),
    false,
  );
  window.addEventListener('focus', () => revalidate(focusRevalidators), false);
  // reconnect revalidate
  window.addEventListener(
    'online',
    () => revalidate(reconnectRevalidators),
    false,
  );
}

const trigger = ($key, shouldRevalidate = true) => {
  const [key, , keyErr, keyValidating] = cache.serializeKey($key);
  if (!key) return Promise.resolve();

  const updaters = cacheRevalidators[key];

  if (key && updaters) {
    const currentState = [
      cache.get(key),
      cache.get(keyErr),
      cache.get(keyValidating),
    ];
    const promises = [];
    for (let i = 0; i < updaters.length; i++) {
      promises.push(updaters[i](shouldRevalidate, ...currentState, i > 0));
    }
    return Promise.all(promises).then(() => cache.get(key));
  }
  return Promise.resolve(cache.get(key));
};

const broadcastState: BroadcastStateInterface = (
  key,
  data,
  error,
  isValidating,
) => {
  const updaters = cacheRevalidators[key];
  if (key && updaters) {
    for (let i = 0; i < updaters.length; ++i) {
      updaters[i](false, data, error, isValidating);
    }
  }
};

const mutate = async ($key, $data, shouldRevalidate = true) => {
  const [key, , keyErr] = cache.serializeKey($key);

  if (isUndefined($data)) return trigger($key, shouldRevalidate);

  mutationTS[key] = Date.now() - 1;
  mutationEndTS[key] = 0;

  const beforeMutaionTs = mutationTS[key];
  const beforeConcurrentPromisesTs = concurrentPromisesTS[key];

  let data, error;

  if ($data && isFunction($data)) {
    try {
      data = await $data(cache.get(key));
    } catch (err) {
      error = err;
    }
  } else if ($data && isFunction($data.then)) {
    try {
      data = await $data;
    } catch (err) {
      error = err;
    }
  } else {
    data = $data;
  }

  if (
    beforeMutaionTs !== mutationTS[key] ||
    beforeConcurrentPromisesTs !== concurrentPromisesTS[key]
  ) {
    if (error) throw error;
    return data;
  }

  if (!isUndefined(data)) {
    cache.set(key, data);
  }
  cache.set(keyErr, error);

  mutationEndTS[key] = Date.now() - 1;

  const updaters = cacheRevalidators[key];
  if (updaters) {
    const promises = [];
    for (let i = 0; i < updaters.length; i++) {
      promises.push(
        updaters[i](!!shouldRevalidate, data, error, undefined, i > 0),
      );
    }
    return Promise.all(promises).then(() => {
      if (error) throw error;
      return cache.get(key);
    });
  }

  if (error) throw error;
  return data;
};

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
// TODO: COMMENT NEED
// function useSWR<D = any, E = any>(...args): UseSWRReturnType<D, E> {
function useSWR<D = any, E = any>(...args): any {
  if (getCurrentInstance()) {
    let $key: KeyInterface,
      fetcher: Fetcher<D> | undefined,
      config: ConfigInterface<D, E> = {};

    if (args.length >= 1) {
      $key = unref(args[0]);
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
    // `keyErr` is the cache key for error objects
    const [key, fetcherArgs, keyErr, keyValidating] = cache.serializeKey($key);

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

    const state = reactive({
      data: resolveData(),
      error: cache.get(keyErr),
      isValidating: !!cache.get(keyValidating),
    });

    let unmounted = false;

    const boundMutate = (data, shouldRevalidate) =>
      mutate(key, data, shouldRevalidate);

    const addRevalidator = (revalidators, callback) => {
      if (!callback) return;
      if (!revalidators[key]) {
        revalidators[key] = [callback];
      } else {
        revalidators[key].push(callback);
      }
    };

    const removeRevalidator = (revlidators, callback) => {
      if (revlidators[key]) {
        const revalidators = revlidators[key];
        const index = revalidators.indexOf(callback);
        if (index >= 0) {
          revalidators.splice(index, 1);
        }
      }
    };

    const revalidate = async () => {
      if (!key || !fetcher) return false;
      if (unmounted) return false;

      let loading = true;
      let shouldDeduping = !isUndefined(concurrentPromises[key]);

      try {
        state.isValidating = true;
        cache.set(keyValidating, true);
        if (!shouldDeduping) {
          // also update other hooks
          broadcastState(key, undefined, undefined, true);
        }

        let newData;
        let startAt;

        if (shouldDeduping) {
          startAt = concurrentPromisesTS[key];
          newData = await concurrentPromises[key];
        } else {
          if (isDef(config.loadingTimeout) && config.loadingTimeout > 0) {
            setTimeout(() => {
              if (loading) config.onLoadingSlow(key, config);
            }, config.loadingTimeout);
          }

          concurrentPromises[key] =
            fetcherArgs !== null ? fetcher(...fetcherArgs) : fetcher(key);

          concurrentPromisesTS[key] = startAt = Date.now();

          newData = await concurrentPromises[key];

          setTimeout(() => {
            delete concurrentPromises[key];
            delete concurrentPromisesTS[key];
          }, config.dedupingInterval);

          config.onSuccess(newData, key, config);
        }

        const shouldIgnoreRequest =
          concurrentPromisesTS[key] > startAt ||
          (mutationTS[key] &&
            (startAt <= mutationTS[key] ||
              startAt <= mutationEndTS[key] ||
              mutationEndTS[key] === 0));

        if (shouldIgnoreRequest) {
          state.isValidating = false;
          return false;
        }

        cache.set(key, newData);
        cache.set(keyErr, undefined);
        cache.set(keyValidating, false);

        if (!isEqual(state.data, newData)) {
          state.data = newData;
        }

        if (!shouldDeduping) {
          // also update other hooks
          broadcastState(key, newData, undefined, false);
        }
      } catch (err) {
        delete concurrentPromises[key];
        delete concurrentPromisesTS[key];

        cache.set(keyErr, err);

        if (state.error !== err) {
          state.isValidating = false;
          state.error = err;

          if (!shouldDeduping) {
            // also broadcast to update other hooks
            broadcastState(key, undefined, err, false);
          }
        }

        config.onError(err, key, config);
        // if(config.shouldRetryOnError) {
          
        // }

      }

      loading = false;
      return true;
    };

    watchEffect(() => {

    });

    return { ...toRefs(state), revalidate: () => {}, mutate: boundMutate };
  } else {
    throw new Error(
      'Invalid hook call: `useSWR` can only be called inside of `setup()`.',
    );
  }
}

export default useSWR;
