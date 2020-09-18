import { readonly, ref, unref } from 'vue-demi';
import { add, subtract, bignumber, format } from 'mathjs';
import { isDef, isFunction } from '../libs/helper';

import type { Ref } from 'vue-demi';
import type { RefTyped } from 'typings/global';

type NumberType = number | string;

interface ICounterOptions {
  min?: RefTyped<NumberType>;
  max?: RefTyped<NumberType>;
  x?: RefTyped<NumberType>;
}

interface ICounterActions {
  inc: (n?: RefTyped<NumberType>) => void;
  dec: (n?: RefTyped<NumberType>) => void;
  set: (
    value: RefTyped<NumberType> | ((currentValue: number) => number),
  ) => void;
  reset: () => void;
}

const isNumber = (n: any) => !isNaN(unref(n));

function useCounter(
  initialValue: RefTyped<NumberType>,
  options: ICounterOptions = {},
): [Ref<number>, ICounterActions] {
  const { min, max, x } = options;
  const initial = () =>
    isNumber(initialValue) ? Number(unref(initialValue)) : 0;
  const _x = () => (isNumber(x) ? Number(unref(x)) : 1);

  const fix = (num: RefTyped<number>) => {
    const result = ref(unref(num));
    if (isNumber(max)) {
      result.value = Math.min(Number(unref(max)), result.value);
    }
    if (isNumber(min)) {
      result.value = Math.max(Number(unref(min)), result.value);
    }
    return result.value;
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
    readonly(current),
    {
      inc,
      dec,
      set,
      reset,
    },
  ];
}

export default useCounter;
