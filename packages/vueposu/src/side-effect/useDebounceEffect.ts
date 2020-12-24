import { unref, watch, getCurrentInstance } from 'vue-demi';
import { useDebounceFn } from 'vueposu';

import type { WatchSource, WatchCallback } from 'vue-demi';
import type { RefTyped } from '@vueposu/shared';

// TODO: COMMENT NEED
// type MapSources<T> = {
//   [K in keyof T]: T[K] extends WatchSource<infer V>
//     ? V
//     : T[K] extends object
//     ? T[K]
//     : never;
// };

// TODO: COMMENT NEED
// function useDebounceEffect<
//   T extends Readonly<Array<WatchSource<unknown> | object>>
// >(
//   listener: WatchCallback<MapSources<T>, MapSources<T>>,
//   deps: T,
//   wait?: RefTyped<number>,
// );

export function useDebounceEffect<T>(
  listener: WatchCallback<T, T>,
  deps: WatchSource<T>,
  wait?: RefTyped<number>,
);

export function useDebounceEffect<T extends object>(
  listener: WatchCallback<T, T>,
  deps: T,
  wait?: RefTyped<number>,
);

export function useDebounceEffect<T = any>(
  listener: any,
  deps: T | WatchSource<T>,
  wait: RefTyped<number> = 0,
) {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useDebounceEffect` can only be called inside of `setup()`.',
    );
  }

  const debounced = useDebounceFn(listener, wait);

  watch(deps as any, (value, oldValue) =>
    unref(wait) > 0
      ? debounced.value(value, oldValue)
      : listener(value, oldValue),
  );
}
