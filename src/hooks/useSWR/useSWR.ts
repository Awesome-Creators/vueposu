// TODO: MIT license

// inspired by vercel swr: https://github.com/vercel/swr
// learn at: https://github.com/chenbin92/swr-source-code

import { ref, unref, watchEffect, getCurrentInstance } from 'vue-demi';
import cache from './cache';
import defaultConfig from './config';
import isDocumentVisible from '../../libs/isDocumentVisible';
import isOnline from '../../libs/isOnline';
import {
  isFunction,
  isObject,
  isUndefined,
  isDef,
  isUndef,
  isEqual,
} from '../../libs/helper';

import type {
  Fetcher,
  SWRKey,
  SWRConfig,
  UseSWRReturnType,
  BroadcastState,
  RevalidateOptions,
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

const serialize = (key) => cache.serializeKey(key);

const trigger = ($key, shouldRevalidate = true) => {
  const [key, , keyErr, keyValidating] = serialize($key);
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

const broadcastState: BroadcastState = (key, data, error, isValidating) => {
  const updaters = cacheRevalidators[key];
  if (key && updaters) {
    for (let i = 0; i < updaters.length; ++i) {
      updaters[i](false, data, error, isValidating);
    }
  }
};

const mutate = async ($key, $data, shouldRevalidate = true) => {
  const [key, , keyErr] = serialize($key);

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

function useSWR<D = any, E = any>(key: SWRKey): UseSWRReturnType<D, E>;

function useSWR<D = any, E = any>(
  key: SWRKey,
  config?: SWRConfig<D, E>,
): UseSWRReturnType<D, E>;

function useSWR<D = any, E = any>(
  key: SWRKey,
  fetcher?: Fetcher<D>,
  config?: SWRConfig<D, E>,
): UseSWRReturnType<D, E>;

// TODO: COMMENT NEED
function useSWR<D = any, E = any>(...args): UseSWRReturnType<D, E> {
  if (getCurrentInstance()) {
    let $key: SWRKey,
      fetcher: Fetcher<D> | undefined,
      config: SWRConfig<D, E> = {};

    if (args.length > 0) {
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

    config = {
      ...defaultConfig.value,
      ...config,
    };

    if (isUndef(fetcher)) {
      fetcher = config.fetcher;
    }

    let [key, fetcherArgs, keyErr, keyValidating] = serialize($key);

    const resolveData = () => {
      [key] = serialize($key);
      const cachedData = cache.get(key);
      return isUndefined(cachedData) ? config.initialData : cachedData;
    };

    const data = ref(resolveData());
    const error = ref(cache.get(keyErr));
    const isValidating = ref(!!cache.get(keyValidating));

    let unmounted = false;

    const boundMutate = (data, shouldRevalidate) => {
      [key] = serialize($key);
      return mutate(key, data, shouldRevalidate);
    };

    const addRevalidator = (revalidators, callback) => {
      [key] = serialize($key);
      if (!callback) return;
      if (!revalidators[key]) {
        revalidators[key] = [callback];
      } else {
        revalidators[key].push(callback);
      }
    };

    const removeRevalidator = (revlidators, callback) => {
      [key] = serialize($key);
      if (revlidators[key]) {
        const revalidators = revlidators[key];
        const index = revalidators.indexOf(callback);
        if (index >= 0) {
          revalidators.splice(index, 1);
        }
      }
    };

    const revalidate = async (options: RevalidateOptions = {}) => {
      [key, fetcherArgs, keyErr, keyValidating] = serialize($key);
      if (!key || !fetcher || unmounted) return false;
      options = { dedupe: false, ...options };

      let loading = true;
      let shouldDeduping =
        !isUndefined(concurrentPromises[key]) && options.dedupe;

      try {
        isValidating.value = true;
        cache.set(unref(keyValidating), true);
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
          const loadingTimeout = unref(config.loadingTimeout);
          if (isDef(loadingTimeout) && loadingTimeout > 0) {
            setTimeout(() => {
              if (loading) config.onLoadingSlow(key, config);
            }, loadingTimeout);
          }

          concurrentPromises[key] =
            fetcherArgs !== null ? fetcher(...fetcherArgs) : fetcher(key);

          concurrentPromisesTS[key] = startAt = Date.now();

          newData = await concurrentPromises[key];

          setTimeout(() => {
            delete concurrentPromises[key];
            delete concurrentPromisesTS[key];
          }, unref(config.dedupingInterval));

          config.onSuccess(newData, key, config);
        }

        const shouldIgnoreRequest =
          concurrentPromisesTS[key] > startAt ||
          (mutationTS[key] &&
            (startAt <= mutationTS[key] ||
              startAt <= mutationEndTS[key] ||
              mutationEndTS[key] === 0));

        if (shouldIgnoreRequest) {
          isValidating.value = false;
          return false;
        }

        cache.set(key, newData);
        cache.set(keyErr, undefined);
        cache.set(keyValidating, false);

        if (!isEqual(data.value, newData)) {
          data.value = newData;
        }

        if (!shouldDeduping) {
          // also update other hooks
          broadcastState(key, newData, undefined, false);
        }
      } catch (err) {
        delete concurrentPromises[key];
        delete concurrentPromisesTS[key];

        cache.set(keyErr, err);

        if (error.value !== err) {
          isValidating.value = false;
          error.value = err;

          if (!shouldDeduping) {
            // also broadcast to update other hooks
            broadcastState(key, undefined, err, false);
          }
        }

        config.onError(err, key, config);
        if (config.shouldRetryOnError) {
          const retryCount = (options.retryCount || 0) + 1;
          config.onErrorRetry(err, key, config, revalidate, {
            dedupe: true,
            ...options,
            retryCount,
          });
        }
      }

      loading = false;
      return true;
    };

    watchEffect(onInvalidate => {
      [key] = serialize($key);
      if (!key) return;

      unmounted = false;

      const latestKeyedData = resolveData();

      if (!isEqual(data.value, latestKeyedData)) {
        data.value = latestKeyedData;
      }

      const softRevalidate = () => revalidate({ dedupe: true });

      if (!isUndefined(latestKeyedData)) {
        rIC(softRevalidate);
      } else {
        softRevalidate();
      }

      let pending = false;
      const onFocus = () => {
        if (pending || !unref(config.revalidateOnFocus)) return;
        pending = true;
        softRevalidate();
        setTimeout(
          () => (pending = false),
          unref(config.focusThrottleInterval),
        );
      };

      const onReconnect = () => {
        if (unref(config.revalidateOnReconnect)) softRevalidate();
      };

      const onUpdate = (
        shouldRevalidate = true,
        updatedData,
        updatedError,
        updatedIsValidating,
        dedupe = true,
      ) => {
        if (!isUndefined(updatedData) && !isEqual(data.value, updatedData)) {
          data.value = updatedData;
        }

        if (error.value !== updatedError) {
          error.value = updatedError;
        }

        if (
          !isUndefined(updatedIsValidating) &&
          isValidating.value !== !!updatedIsValidating
        ) {
          isValidating.value = !!updatedIsValidating;
        }

        if (shouldRevalidate) {
          return dedupe ? softRevalidate() : revalidate();
        }

        return false;
      };

      addRevalidator(focusRevalidators, onFocus);
      addRevalidator(reconnectRevalidators, onReconnect);
      addRevalidator(cacheRevalidators, onUpdate);

      onInvalidate(() => {
        unmounted = true;
        removeRevalidator(focusRevalidators, onFocus);
        removeRevalidator(reconnectRevalidators, onReconnect);
        removeRevalidator(cacheRevalidators, onUpdate);
      });
    });

    watchEffect(onInvalidate => {
      let timer = null;
      const tick = async () => {
        if (
          !error.value &&
          (unref(config.refreshWhenHidden) || isDocumentVisible()) &&
          (unref(config.refreshWhenOffline) || isOnline())
        ) {
          await revalidate({ dedupe: true });
        }
        const refreshInterval = unref(config.refreshInterval) || 0;
        if (refreshInterval && !error.value) {
          timer = setTimeout(tick, refreshInterval);
        }
      };

      onInvalidate(() => {
        if (timer) clearTimeout(timer);
      });
    });

    return { data, error, isValidating, revalidate, mutate: boundMutate };
  } else {
    throw new Error(
      'Invalid hook call: `useSWR` can only be called inside of `setup()`.',
    );
  }
}

export default useSWR;
