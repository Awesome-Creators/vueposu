import { unref, watch } from "vue-demi";
import { useDebounceFn } from "vueposu";

import type { WatchSource, WatchCallback } from "vue-demi";
import type { RefTyped, Fn } from "@vueposu/utils";

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
  wait?: RefTyped<number>
): void;
export function useDebounceEffect<T extends object>(
  listener: WatchCallback<T, T>,
  deps: T,
  wait?: RefTyped<number>
): void;
export function useDebounceEffect<T = any>(
  listener: Fn,
  deps: T | WatchSource<T>,
  wait: RefTyped<number> = 0
) {
  const debounced = useDebounceFn(listener, wait);

  watch(deps as any, (value, oldValue) =>
    unref(wait) > 0
      ? debounced.value(value, oldValue)
      : listener(value, oldValue)
  );
}
