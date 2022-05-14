import { ref, unref, readonly, watch } from 'vue-demi';
import { useCounter, useInterval } from 'vueposu';

import type { Ref } from 'vue-demi';
import type { CounterNumber } from 'vueposu';
import type { RefTyped } from '@vueposu/utils';

interface UseCounterIntervalOptions {
  initialValue?: CounterNumber;
  type?: RefTyped<'inc' | 'dec'>;
  step?: RefTyped<number>;
  total?: RefTyped<number>;
  interval?: RefTyped<number>;
  immediateStart?: RefTyped<boolean>;
}

type UseCounterIntervalActions = {
  start: () => void;
  stop: () => void;
};
type UseCounterIntervalReturnType = {
  count: CounterNumber;
  isActive: Ref<boolean>;
} & UseCounterIntervalActions;

// TODO: COMMENT NEED
export function useCounterInterval(
  options: UseCounterIntervalOptions = {},
): UseCounterIntervalReturnType {
  const {
    initialValue = 60,
    type = 'dec',
    step = 1,
    total = 0,
    interval = 1000,
    immediateStart = false,
  } = options;

  const { count, inc, dec } = useCounter(initialValue);

  // TODO: check total is gt or lt than initialValue
  const { isActive: $isActive, start, stop } = useInterval(
    () => {
      if (unref(type) === 'dec' && count.value > unref(total)) {
        dec(step);
      } else if (unref(type) === 'inc' && count.value < unref(total)) {
        inc(step);
      }
    },
    interval,
    immediateStart,
  );

  const isActive = ref(unref($isActive));

  watch(count, () => {
    if (count.value === unref(total)) isActive.value = false;
  });

  return {
    count,
    isActive: readonly(isActive),
    start: () => {
      start();
      isActive.value = true;
    },
    stop: () => {
      stop();
      isActive.value = false;
    },
  };
}
