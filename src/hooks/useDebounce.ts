import { ref, unref, watch } from 'vue-demi';
import useDebounceFn from '../hooks/useDebounceFn';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

// TODO: COMMENT NEED
export default function useDebounce<T>(
  value: Ref<T>,
  wait: RefTyped<number> = 0,
) {
  if (unref(wait) === 0) return value;
  const delayValue = ref(unref(value)) as Ref<T>;

  watch(value, () => {
    useDebounceFn(() => {
      delayValue.value = unref(value);
    }, unref(wait));
  });

  return delayValue;
}
