import debounce from '../libs/debounce';
import { watch } from 'vue-demi';

import type { WatchSource } from 'vue-demi';

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

export default function useDebounceEffect<T>(
  listener: EffectListener<T>,
  deps: T,
  wait: number = 0,
) {
  const $listener = (value, oldValue) => listener(value, oldValue);
  const debounced = debounce($listener, wait);

  watch(deps, wait > 0 ? debounced : $listener);
}