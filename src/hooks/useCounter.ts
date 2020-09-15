import { ref, computed, ComputedRef } from 'vue';
import * as math from 'mathjs';
import { isFunction } from '../libs/helper';

type NumberType = number | string;

interface ICounterOptions<T = number> {
  min?: T;
  max?: T;
  granularity?: T;
}

interface ICounterActions<T = number> {
  inc: (n?: T) => void;
  dec: (n?: T) => void;
  set: (value: T | ((currentValue: T) => T)) => void;
  reset: () => void;
}

const isNumberType = (n: any) => !isNaN(Number(n));

function useCounter(
  initialValue?: number,
  options?: ICounterOptions<number>,
): [ComputedRef<number>, ICounterActions<number>];

function useCounter(
  initialValue?: string,
  options?: ICounterOptions<number>,
): [ComputedRef<number>, ICounterActions<number>];

function useCounter(
  initialValue: NumberType,
  options: ICounterOptions<NumberType> = {},
): [ComputedRef<NumberType>, ICounterActions<NumberType>] {
  const counterType = Number;

  let { min, max, granularity = 1 } = options;

  granularity = isNumberType(granularity) ? Number(granularity) : 1;
  initialValue = isNumberType(initialValue) ? Number(initialValue) : 0;

  if (isNumberType(max)) {
    initialValue = Math.min(Number(max), initialValue);
  }
  if (isNumberType(min)) {
    initialValue = Math.max(Number(min), initialValue);
  }

  const current = ref(initialValue);

  const set: ICounterActions['set'] = v => {
    let result = isFunction(v) ? v(current.value) : v;
    if (isNumberType(max)) {
      result = Math.min(Number(max), result);
    }
    if (isNumberType(min)) {
      result = Math.max(Number(min), result);
    }
    current.value = result;
  };

  const inc: ICounterActions['inc'] = n => {
    set(
      Number(
        math.add(
          math.bignumber(current.value),
          math.bignumber(isNumberType(n) ? Number(n) : (granularity as number)),
        ),
      ),
    );
  };

  const dec: ICounterActions['dec'] = n => {
    set(
      Number(
        math.subtract(
          math.bignumber(current.value),
          math.bignumber(isNumberType(n) ? Number(n) : (granularity as number)),
        ),
      ),
    );
  };

  const reset: ICounterActions['reset'] = () => {
    current.value = initialValue as number;
  };

  return [
    computed(() => counterType(current.value)),
    {
      inc,
      dec,
      set,
      reset,
    },
  ];
}

export default useCounter;
