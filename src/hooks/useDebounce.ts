import { ref, unref, readonly, watch } from 'vue-demi';
import useDebounceFn from '../hooks/useDebounceFn';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

// TODO: COMMENT NEED
export default function useDebounce<T>(
  value: Ref<T>,
  wait: RefTyped<number> = 0,
) {
  const debouncedValue = ref(unref(value)) as any;
  const debounced = useDebounceFn(
    () => (debouncedValue.value = unref(value)),
    wait,
  );

  watch(value, () =>
    unref(wait) > 0 ? debounced.value() : (debouncedValue.value = unref(value)),
  );

  return readonly(debouncedValue);
}
