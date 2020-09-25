import throttle from '../libs/throttle';
import { WatchSource, watch } from 'vue-demi';

// TODO: COMMENT NEED
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

export default function useThrottleEffect<T>(
  listener: EffectListener<T>,
  deps: T,
  wait: number = 0,
) {
  const $listener = (value, oldValue) => listener(value, oldValue);
  const throttled = throttle($listener, wait);

  watch(deps, wait > 0 ? throttled : $listener);
}
