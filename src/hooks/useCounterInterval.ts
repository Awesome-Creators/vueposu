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

type UseCounterIntervalReturnType = [
  conter: CounterNumber,
  active: Ref<boolean>,
  start: () => void,
  stop: () => void,
];

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

  const [counter, { inc, dec }] = useCounter(initialValue);

  const [$active, $start, $stop] = useInterval({
    cb: () => {
      if (type === 'dec' && counter.value > total) {
        dec(step);
      } else if (type === 'inc' && counter.value < total) {
        inc(step);
      }
    },
    interval,
    immediateStart,
  });

  const active = ref($active);

  watch(counter, ct => {
    if (ct === total) active.value = false;
  });

  const start = () => {
    $start();
    active.value = true;
  };

  const stop = () => {
    $stop();
    active.value = false;
  };

  return [counter, active, start, stop];
}
