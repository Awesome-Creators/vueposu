// TODO: MIT license

// inspired by vercel swr: https://github.com/vercel/swr
// learn at: https://github.com/chenbin92/swr-source-code

import {
  ref,
  unref,
  readonly,
  watch,
  watchEffect,
  isRef,
  isReactive,
  getCurrentInstance,
} from 'vue-demi';
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
  isServer,
} from '../../libs/helper';

import type {
  Fetcher,
  SWRKey,
  SWRConfig,
  UseSWRReturnType,
  Mutate,
  BroadcastState,
  RevalidateOptions,
} from './types';

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

export const trigger = ($key, shouldRevalidate = true) => {
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

const broadcastState: BroadcastState = (key, data, error, isValidating) => {
  const updaters = cacheRevalidators[key];
  if (key && updaters) {
    for (let i = 0; i < updaters.length; ++i) {
      updaters[i](false, data, error, isValidating);
    }
  }
};

export const mutate: Mutate = async ($key, $data, shouldRevalidate = true) => {
  const [key, , keyErr] = cache.serializeKey($key);
  if (!key) return;

  if (isUndefined($data)) return trigger($key, shouldRevalidate);

  mutationTS[key] = Date.now() - 1;
  mutationEndTS[key] = 0;

  const beforeMutationTs = mutationTS[key];
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
    beforeMutationTs !== mutationTS[key] ||
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
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useSWR` can only be called inside of `setup()`.',
    );
  }

  let $key: SWRKey,
    fetcher: Fetcher<D> | undefined,
    config: SWRConfig<D, E> = {};

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

  const serialize = () => {
    $key = unref(args[0]);
    return cache.serializeKey($key);
  };

  let [key, fetcherArgs, keyErr, keyValidating] = serialize();

  const resolveData = () => {
    [key] = serialize();
    const cachedData = cache.get(key);
    return isUndefined(cachedData) ? unref(config.initialData) : cachedData;
  };

  const initialData = resolveData();
  const initialError = cache.get(keyErr);
  const initialIsValidating = !!cache.get(keyValidating);

  let $data = initialData;
  const data = ref($data);
  const error = ref(initialError);
  const isValidating = ref(initialIsValidating);

  let unmounted = false;

  const emit = (event, ...params) => {
    if (unmounted) return;
    config[event](...params);
  };

  const boundMutate = ($$data, shouldRevalidate) => {
    [key] = serialize();
    return mutate(key, $$data, shouldRevalidate);
  };

  const addRevalidator = (revalidators, callback) => {
    [key] = serialize();
    if (!callback) return;
    if (!revalidators[key]) {
      revalidators[key] = [callback];
    } else {
      revalidators[key].push(callback);
    }
  };

  const removeRevalidator = (revlidators, callback) => {
    [key] = serialize();
    if (revlidators[key]) {
      const revalidators = revlidators[key];
      const index = revalidators.indexOf(callback);
      if (index >= 0) {
        revalidators.splice(index, 1);
      }
    }
  };

  const revalidate = async (options: RevalidateOptions = {}) => {
    [key, fetcherArgs, keyErr, keyValidating] = serialize();
    if (!key || !fetcher || unmounted) return false;
    options = { dedupe: false, ...options };

    let loading = true;
    let shouldDeduping =
      !isUndefined(concurrentPromises[key]) && options.dedupe;

    try {
      isValidating.value = true;
      cache.set(keyValidating, true);
      if (!shouldDeduping) {
        // also update other hooks
        broadcastState(key, cache.get(key), cache.get(keyErr), true);
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
            if (loading) emit('onLoadingSlow', key, config);
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

        emit('onSuccess', newData, key, config);
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

      if (!isEqual($data, newData)) {
        data.value = $data = newData;
      }
      if (!isUndefined(error.value)) {
        error.value = undefined;
      }
      isValidating.value = false;

      if (!shouldDeduping) {
        // also update other hooks
        broadcastState(key, data.value, error.value, false);
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

      emit('onError', err, key, config);
      if (unref(config.shouldRetryOnError)) {
        const retryCount = (options.retryCount || 0) + 1;
        emit('onErrorRetry', err, key, config, revalidate, {
          dedupe: true,
          ...options,
          retryCount,
        });
      }
    }

    loading = false;
    return true;
  };

  if (isRef(args[0]) || isReactive(args[0])) {
    watch(args[0], () => {
      data.value = $data = resolveData();
    });
  }

  watchEffect(onInvalidate => {
    [key] = serialize();
    if (!key) {
      isValidating.value = false;
      return;
    }

    unmounted = false;

    const latestKeyedData = resolveData();
    if (!isEqual($data, latestKeyedData)) {
      $data = latestKeyedData;
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
      setTimeout(() => (pending = false), unref(config.focusThrottleInterval));
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
      if (!isUndefined(updatedData) && !isEqual($data, updatedData)) {
        data.value = $data = updatedData;
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
    const refreshInterval = ref(config.refreshInterval);
    const tick = async () => {
      if (
        !error.value &&
        (unref(config.refreshWhenHidden) || isDocumentVisible()) &&
        (unref(config.refreshWhenOffline) || isOnline())
      ) {
        await revalidate({ dedupe: true });
      }
      if (refreshInterval.value && !error.value) {
        timer = setTimeout(tick, refreshInterval.value);
      }
    };
    if (refreshInterval.value) {
      timer = setTimeout(tick, refreshInterval.value);
    }

    onInvalidate(() => {
      if (timer) clearTimeout(timer);
    });
  });

  return {
    data: readonly(data),
    error: readonly(error),
    isValidating: readonly(isValidating),
    revalidate,
    mutate: boundMutate,
  };
}

export default useSWR;
