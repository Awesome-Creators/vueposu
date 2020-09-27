import type { CounterNumber } from '../hooks/useCounter';

interface UseCounterIntervalOPtions {
  initialValue: CounterNumber;
  type: 'inc' | 'dec';
  step: number;
  totalTime: number;
  interval: number;
}

type UseCounterIntervalReturnType = [
  active: boolean,
  start: () => void,
  stop: () => void,
];

export default function useCounterInterval(options: UseCounterIntervalOPtions) {
  console.log(options);
}
