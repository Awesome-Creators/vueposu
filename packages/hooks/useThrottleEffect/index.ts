import { unref, watch } from "vue-demi";
import { useThrottleFn } from "vueposu";

import type { WatchSource, WatchCallback } from "vue-demi";
import type { RefTyped } from "@vueposu/utils";

// TODO: COMMENT NEED
// type MapSources<T> = {
//   [K in keyof T]: T[K] extends WatchSource<infer V>
//     ? V
//     : T[K] extends object
//     ? T[K]
//     : never;
// };

// TODO: COMMENT NEED
// function useThrottleEffect<
//   T extends Readonly<Array<WatchSource<unknown> | object>>
// >(
//   listener: WatchCallback<MapSources<T>, MapSources<T>>,
//   deps: T,
//   wait?: RefTyped<number>,
// );

export function useThrottleEffect<T>(
  listener: WatchCallback<T, T>,
  deps: WatchSource<T>,
  wait?: RefTyped<number>
): void;
export function useThrottleEffect<T extends object>(
  listener: WatchCallback<T, T>,
  deps: T,
  wait?: RefTyped<number>
): void;
export function useThrottleEffect<T = any>(
  listener: any,
  deps: T | WatchSource<T>,
  wait: RefTyped<number> = 0
) {
  const throttled = useThrottleFn(listener, wait);

  watch(deps as any, (value, oldValue) =>
    unref(wait) > 0
      ? throttled.value(value, oldValue)
      : listener(value, oldValue)
  );
}
