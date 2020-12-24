import { ref, unref, readonly, watch, getCurrentInstance } from 'vue-demi';
import { useDebounceFn } from 'vueposu';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '@vueposu/shared';

// TODO: COMMENT NEED
export function useDebounce<T>(value: Ref<T>, wait: RefTyped<number> = 0) {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useDebounce` can only be called inside of `setup()`.',
    );
  }

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
