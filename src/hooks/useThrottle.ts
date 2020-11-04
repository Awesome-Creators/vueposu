import { ref, unref, readonly, watch } from 'vue-demi';
import useThrottleFn from '../hooks/useThrottleFn';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

// TODO: COMMENT NEED
export default function useThrottle<T>(
  value: Ref<T>,
  wait: RefTyped<number> = 0,
) {
  const throttledValue = ref(unref(value)) as Ref<T>;
  const throttled = useThrottleFn(
    () => (throttledValue.value = unref(value)),
    wait,
  );

  watch(value, () =>
    unref(wait) > 0 ? throttled.value() : (throttledValue.value = unref(value)),
  );

  return readonly(throttledValue);
}