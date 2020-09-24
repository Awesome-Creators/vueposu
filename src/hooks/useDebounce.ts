import { ref, watch } from 'vue-demi';
import type { Ref } from 'vue-demi';
import useDebounceFn from '../hooks/useDebounceFn';

export default function useDebounce<T>(value: Ref<T>, wait = 0) {
  if (wait === 0) return value;
  const delayValue = ref(value.value) as Ref<T>;

  watch(
    value,
    useDebounceFn(() => {
      delayValue.value = value.value;
    }, wait),
  );

  return delayValue;
}
