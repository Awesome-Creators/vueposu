import debounce from '../libs/debounce';
import { WatchSource, watch } from 'vue-demi';

export declare type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
) => any;

export default function useDebounceEffect<T>(
  listener: WatchCallback<T, T>,
  deps: WatchSource<T>,
  wait: number = 0,
) {
  const $listener = (a, b) => listener(a, b);
  const debounced = debounce($listener, wait);

  watch(deps, wait > 0 ? debounced : $listener);
}
