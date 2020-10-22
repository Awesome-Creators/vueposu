import { ref, unref, watch } from 'vue-demi';
import useThrottleFn from '../hooks/useThrottleFn';

import type { Ref } from 'vue-demi';

// TODO: COMMENT NEED
export default function useThrottle<T>(value: Ref<T>, wait = 0) {
  if (wait === 0) return value;
  const delayValue: Ref<T> = ref(unref(value)) as Ref<T>;

  const updater = useThrottleFn(() => {
    delayValue.value = unref(value);
  }, wait);

  watch(value, updater);

  return delayValue;
}
