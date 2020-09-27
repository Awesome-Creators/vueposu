import useCounter from '../hooks/useCounter';
import type { CounterNumber } from '../hooks/useCounter';
import { useInterval } from '..';

interface UseCounterIntervalOptions {
  initialValue?: CounterNumber;
  type?: 'inc' | 'dec';
  step?: number;
  total?: number;
  interval?: number;
}

type UseCounterIntervalReturnType = [
  conter: CounterNumber,
  active: boolean,
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
  } = options;

  const [counter, { inc, dec }] = useCounter(initialValue);
  const [, stop] = useInterval({
    cb: () => {
      if (type === 'dec' && counter.value > total) {
        dec(step);
      } else if (type === 'inc' && counter.value < total) {
        inc(step);
      } else {
        stop();
      }
    },
    interval,
  });

  return [counter, true, () => {}, () => {}];
}
