import { ref, unref, watch } from 'vue-demi';
import useDebounceFn from '../hooks/useDebounceFn';

import type { Ref } from 'vue-demi';

// TODO: COMMENT NEED
export default function useDebounce<T>(value: Ref<T>, wait = 0) {
  if (wait === 0) return value;
  const delayValue = ref(unref(value)) as Ref<T>;

  watch(
    value,
    useDebounceFn(() => {
      delayValue.value = unref(value);
    }, wait),
  );

  return delayValue;
}
