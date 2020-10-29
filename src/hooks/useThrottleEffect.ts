import { unref, watch, getCurrentInstance } from 'vue-demi';
import useThrottleFn from './useThrottleFn';

import type { Ref, WatchSource } from 'vue-demi';
import type { RefTyped } from '../types/global';

// TODO: COMMENT NEED
type MapSources<T> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? V
    : T[K] extends object
    ? T[K]
    : never;
};

type EffectListener<T> = (
  value?: MapSources<T>,
  oldValue?: MapSources<T>,
) => void;

// TODO: COMMENT NEED
export default function useThrottleEffect<T extends Ref>(
  listener: EffectListener<T>,
  deps: T,
  wait: RefTyped<number> = 0,
) {
  if (getCurrentInstance()) {
    const throttled = useThrottleFn(listener, wait);

    watch(deps, (...args: Parameters<EffectListener<T>>) =>
      unref(wait) > 0 ? throttled.value(...args) : listener(...args),
    );
  } else {
    throw new Error(
      'Invalid hook call: `useThrottleEffect` can only be called inside of `setup()`.',
    );
  }
}
