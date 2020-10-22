import { ref, unref, watch } from 'vue-demi';
import useThrottleFn from '../hooks/useThrottleFn';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

// TODO: COMMENT NEED
export default function useThrottle<T>(
  value: Ref<T>,
  wait: RefTyped<number> = 0,
) {
  wait = unref(wait);
  
  if (wait === 0) return value;
  const delayValue: Ref<T> = ref(unref(value)) as Ref<T>;

  watch(
    value,
    useThrottleFn(() => {
      delayValue.value = unref(value);
    }, wait),
  );

  return delayValue;
}
