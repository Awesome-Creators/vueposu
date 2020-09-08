import { ref, computed, ComputedRef } from 'vue';

interface ICounterOptions {
  min?: number;
  max?: number;
  granularity?: number;
}

interface ICounterActions {
  inc: (n?: number) => void;
  dec: (n?: number) => void;
  set: (value: number | ((currentValue: number) => number)) => void;
  reset: () => void;
}

const isNumber = (n: any) => typeof n === 'number' && !isNaN(n);

export default function useCounter(
  initialValue: number = 0,
  options: ICounterOptions = {},
): [ComputedRef<number>, ICounterActions] {
  const { min, max } = options;
  const granularity = isNumber(options.granularity) ? options.granularity : 1;

  const current = ref(
    isNumber(initialValue)
      ? (() => {
          if (isNumber(max)) {
            initialValue = Math.min(max, initialValue);
          }
          if (isNumber(min)) {
            initialValue = Math.max(min, initialValue);
          }
          return initialValue;
        })()
      : (initialValue = 0),
  );

  const set: ICounterActions['set'] = v => {
    let result = typeof v === 'function' ? v(current.value) : v;
    if (isNumber(max)) {
      result = Math.min(max, result);
    }
    if (isNumber(min)) {
      result = Math.max(min, result);
    }
    current.value = result;
  };

  const inc: ICounterActions['inc'] = (n = granularity) => {
    set(current.value + n);
  };

  const dec: ICounterActions['dec'] = (n = granularity) => {
    set(current.value - n);
  };

  const reset: ICounterActions['reset'] = () => {
    current.value = initialValue;
  };

  return [
    computed(() => current.value),
    {
      inc,
      dec,
      set,
      reset,
    },
  ];
}
