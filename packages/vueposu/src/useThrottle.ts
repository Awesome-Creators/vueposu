import { ref, unref, readonly, watch, getCurrentInstance } from 'vue-demi';
import useThrottleFn from './useThrottleFn';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '@vueposu/shared/types/global';

// TODO: COMMENT NEED
export default function useThrottle<T>(
  value: Ref<T>,
  wait: RefTyped<number> = 0,
) {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useThrottle` can only be called inside of `setup()`.',
    );
  }

  const throttledValue = ref(unref(value)) as any;
  const throttled = useThrottleFn(
    () => (throttledValue.value = unref(value)),
    wait,
  );

  watch(value, () =>
    unref(wait) > 0 ? throttled.value() : (throttledValue.value = unref(value)),
  );

  return readonly(throttledValue);
}
