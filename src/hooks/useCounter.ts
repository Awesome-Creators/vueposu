import { ref, unref, computed } from 'vue-demi';
import { add, subtract, bignumber, format } from 'mathjs';
import { isDef, isFunction } from '../libs/helper';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

type NumberType = number | string;
export type CounterNumber = RefTyped<NumberType>;

type UseCounterActions = {
  inc: (n?: CounterNumber) => void;
  dec: (n?: CounterNumber) => void;
  set: (value: CounterNumber | ((currentValue: number) => number)) => void;
  reset: () => void;
};
type UseCounterReturnType = {
  count: Ref<number>;
} & UseCounterActions;

// TODO: COMMENT NEED
interface CounterOptions {
  min?: CounterNumber;
  max?: CounterNumber;
  step?: CounterNumber;
}

const isNumber = (n: any) => isDef(n) && !isNaN(unref(n));

function useCounter(
  initialValue: RefTyped<NumberType>,
  options: CounterOptions = {},
): UseCounterReturnType {
  const { min, max, step } = options;
  const initial = () =>
    isNumber(initialValue) ? Number(unref(initialValue)) : 0;
  const $step = () => (isNumber(step) ? Number(unref(step)) : 1);

  const fix = (num: RefTyped<NumberType>) => {
    let result = +unref(num);
    if (isNumber(max)) {
      result = Math.min(Number(unref(max)), result);
    }
    if (isNumber(min)) {
      result = Math.max(Number(unref(min)), result);
    }
    return result;
  };

  const current = ref(fix(initial()));

  const set: UseCounterActions['set'] = v => {
    current.value = fix(isFunction(v) ? v(current.value) : v);
  };

  const inc: UseCounterActions['inc'] = v =>
    set(
      Number(
        format(
          add(
            bignumber(current.value),
            bignumber(isDef(v) && isNumber(v) ? unref(v) : $step()),
          ),
        ),
      ),
    );

  const dec: UseCounterActions['dec'] = v =>
    set(
      Number(
        format(
          subtract(
            bignumber(current.value),
            bignumber(isDef(v) && isNumber(v) ? unref(v) : $step()),
          ),
        ),
      ),
    );

  const reset: UseCounterActions['reset'] = () => set(fix(initial()));

  const count = computed({
    get: () => current.value,
    set: v => {
      if (isNumber(v)) {
        set(v);
      } else {
        throw new TypeError(
          `Invalid assignment: expected a number-string or number but got: ${
            isDef(v) ? typeof v : v
          }`,
        );
      }
    },
  });

  return {
    count,
    inc,
    dec,
    set,
    reset,
  };
}

export default useCounter;
