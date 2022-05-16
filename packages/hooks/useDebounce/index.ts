import { ref, unref, readonly, watch } from "vue-demi";
import { useDebounceFn } from "vueposu";

import type { Ref } from "vue-demi";
import type { RefTyped } from "@vueposu/utils";

// TODO: COMMENT NEED
export function useDebounce<T>(value: Ref<T>, wait: RefTyped<number> = 0) {
  const debouncedValue = ref(unref(value)) as Ref<T>;
  const debounced = useDebounceFn(
    () => (debouncedValue.value = unref(value)),
    wait
  );

  watch(value, () =>
    unref(wait) > 0 ? debounced.value() : (debouncedValue.value = unref(value))
  );

  return readonly(debouncedValue);
}