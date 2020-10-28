import { ref, unref, watch } from 'vue-demi';
import useDebounceFn from '../hooks/useDebounceFn';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

// TODO: COMMENT NEED
export default function useDebounce<T>(
  value: Ref<T>,
  wait: RefTyped<number> = 0,
) {
  const delayValue = ref(unref(value)) as Ref<T>;
  const debounced = useDebounceFn(
    () => (delayValue.value = unref(value)),
    wait,
  );

  watch(value, () =>
    unref(wait) > 0 ? debounced.value() : (delayValue.value = unref(value)),
  );

  return delayValue;
}
