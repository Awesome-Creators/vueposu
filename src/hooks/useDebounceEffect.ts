import { unref, watch, getCurrentInstance } from 'vue-demi';
import useDebounceFn from './useDebounceFn';

import type { Ref, WatchSource } from 'vue-demi';
import type { RefTyped } from '../types/global';

type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? V
    : T[K] extends object
    ? T[K]
    : never;
};

type EffectListener<T> = (
  value: MapSources<T>,
  oldValue: MapSources<T>,
) => void;

// TODO: COMMENT NEED
export default function useDebounceEffect<T extends Ref>(
  listener: EffectListener<T>,
  deps: T,
  wait: RefTyped<number> = 0,
) {
  if (getCurrentInstance()) {
    const $listener = (value, oldValue) => listener(value, oldValue);
    const debounced = useDebounceFn($listener, wait);

    watch(deps, ((value, oldValue) => unref(wait) > 0 ? debounced.value(value, oldValue) : $listener(value, oldValue)));
  } else {
    throw new Error(
      'Invalid hook call: `useDebounceEffect` can only be called inside of `setup()`.',
    );
  }
}
