import { ref, unref, computed, watchEffect } from "vue-demi";
import { isDef, isFunction, add, subtract } from "@vueposu/utils";

import type { Ref } from "vue-demi";
import type { NumberType, CounterNumber } from "@vueposu/utils";

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

export function useCounter(
  initialValue?: CounterNumber,
  options: CounterOptions = {}
): UseCounterReturnType {
  const { min, max, step } = options;
  const initial = () =>
    isNumber(initialValue) ? Number(unref(initialValue)) : 0;
  const $step = () => (isNumber(step) ? Number(unref(step)) : 1);

  const fix = (num: CounterNumber) => {
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

  const set: UseCounterActions["set"] = (v) => {
    current.value = fix(isFunction(v) ? v(current.value) : v);
  };

  const inc: UseCounterActions["inc"] = (v) =>
    set(
      Number(
        add(current.value, isNumber(v) ? (unref(v) as NumberType) : $step())
      )
    );

  const dec: UseCounterActions["dec"] = (v) =>
    set(
      subtract(current.value, isNumber(v) ? (unref(v) as NumberType) : $step())
    );

  const reset: UseCounterActions["reset"] = () => set(fix(initial()));

  const count = computed({
    get: () => current.value,
    set: (v: CounterNumber) => {
      if (isNumber(v)) {
        set(v);
      } else {
        throw new TypeError(
          `Invalid assignment: expected a number-string or number but got: ${
            isDef(v) ? typeof v : v
          }`
        );
      }
    },
  });

  watchEffect(
    () => {
      // if `min`/`max` is RefTyped, collect dependencies:
      unref(min);
      unref(max);
      set(current.value);
    },
    {
      flush: "sync",
    }
  );

  return {
    count,
    inc,
    dec,
    set,
    reset,
  };
}
