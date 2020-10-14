import useCounter from '../hooks/useCounter';
import type { CounterNumber } from '../hooks/useCounter';
import useInterval from '../hooks/useInterval';
import { ref, watch } from 'vue-demi';
import type { Ref } from 'vue-demi';

interface UseCounterIntervalOptions {
  initialValue?: CounterNumber;
  type?: 'inc' | 'dec';
  step?: number;
  total?: number;
  interval?: number;
  immediateStart?: boolean;
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
export default function useCounterInterval(
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

  const { isActive: $isActive, start, stop } = useInterval({
    cb: () => {
      if (type === 'dec' && count.value > total) {
        dec(step);
      } else if (type === 'inc' && count.value < total) {
        inc(step);
      }
    },
    interval,
    immediateStart,
  });

  const isActive = ref($isActive);

  watch(count, ct => {
    if (ct === total) isActive.value = false;
  });

  return {
    count,
    isActive,
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
