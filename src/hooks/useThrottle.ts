import { ref, unref, readonly, watch } from 'vue-demi';
import useThrottleFn from '../hooks/useThrottleFn';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

// TODO: COMMENT NEED
export default function useThrottle<T>(
  value: Ref<T>,
  wait: RefTyped<number> = 0,
) {
  const delayValue: Ref<T> = ref(unref(value)) as Ref<T>;
  const throttled = useThrottleFn(
    () => (delayValue.value = unref(value)),
    wait,
  );

  watch(value, () =>
    unref(wait) > 0 ? throttled.value() : (delayValue.value = unref(value)),
  );

  return readonly(delayValue);
}
