import { ref, unref, computed } from 'vue-demi';
import { add, subtract, bignumber, format } from 'mathjs';
import { isDef, isFunction } from '../libs/helper';

import type { Ref } from 'vue-demi';
import type { RefTyped } from '../types/global';

type NumberType = number | string;
type UseCounterReturnType = [Ref<number>, CounterActions];
export type CounterNumber = RefTyped<NumberType>;

// TODO: COMMENT NEED
interface CounterOptions {
  min?: CounterNumber;
  max?: CounterNumber;
  x?: CounterNumber;
}

export interface CounterActions {
  inc: (n?: CounterNumber) => void;
  dec: (n?: CounterNumber) => void;
  set: (value: CounterNumber | ((currentValue: number) => number)) => void;
  reset: () => void;
}

const isNumber = (n: any) => isDef(n) && !isNaN(unref(n));

function useCounter(
  initialValue: RefTyped<NumberType>,
  options: CounterOptions = {},
): UseCounterReturnType {
  const { min, max, x } = options;
  const initial = () =>
    isNumber(initialValue) ? Number(unref(initialValue)) : 0;
  const _x = () => (isNumber(x) ? Number(unref(x)) : 1);

  const fix = (num: RefTyped<number>) => {
    let result = unref(num);
    if (isNumber(max)) {
      result = Math.min(Number(unref(max)), result);
    }
    if (isNumber(min)) {
      result = Math.max(Number(unref(min)), result);
    }
    return result;
  };

  const current = ref(fix(initial()));

  const set = v => {
    current.value = fix(isFunction(v) ? v(current.value) : v);
  };

  const inc = v => {
    set(
      Number(
        format(
          add(
            bignumber(current.value),
            bignumber(isDef(v) && isNumber(v) ? unref(v) : _x()),
          ),
        ),
      ),
    );
  };

  const dec = v => {
    set(
      Number(
        format(
          subtract(
            bignumber(current.value),
            bignumber(isDef(v) && isNumber(v) ? unref(v) : _x()),
          ),
        ),
      ),
    );
  };

  const reset = () => {
    set(fix(initial()));
  };

  return [
    computed({
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
    }),
    {
      inc,
      dec,
      set,
      reset,
    },
  ];
}

export default useCounter;
