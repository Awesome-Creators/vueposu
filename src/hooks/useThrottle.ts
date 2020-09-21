import { ref, watch } from 'vue-demi';
import type { Ref } from 'vue-demi';
import useThrottleFn from '../hooks/useDebounceFn';

export default function useThrottle<T>(value: Ref<T>, wait = 0) {
  const delayValue: Ref<T> = ref(value.value) as Ref<T>;

  const updater = useThrottleFn(() => {
    delayValue.value = value.value;
  }, wait);

  watch(value, updater);

  return delayValue;
}
