import { ref, unref, computed } from 'vue-demi';
import { isDef } from '../libs/helper';

import type { UnwrapRef, WritableComputedRef } from 'vue-demi';
import type { RefTyped } from '../types/global';

type IState = string | number | boolean | null | undefined;

interface IActions {
  setLeft: () => void;
  setRight: () => void;
  toggle: (value?: any) => void;
}

/**
 * useToggle function
 *
 * @param defaultValue Truth value, default is `true`  - an optional parameter
 * @param reverseValue False value, default is `false` - an optional parameter
 * @returns [ status, { toggle, setLeft, setRight } ]
 */
function useToggle<D extends RefTyped<IState>, R extends RefTyped<IState>>(
  defaultValue?: D,
  reverseValue?: R,
): [WritableComputedRef<UnwrapRef<D> | UnwrapRef<R>>, IActions] {
  const getDefault = () =>
    (isDef(unref(defaultValue)) ? unref(defaultValue) : true) as D;
  const getReverse = () =>
    (isDef(unref(reverseValue)) ? unref(reverseValue) : !getDefault()) as R;

  const status = ref<D | R>(getDefault());

  const actions = {
    toggle: value => { 
      status.value = isDef(unref(value))
        ? unref(value)
        : status.value !== getDefault()
        ? getDefault()
        : getReverse();
    },
    setLeft: () => {
      status.value = getDefault() as UnwrapRef<D>;
    },
    setRight: () => {
      status.value = getReverse() as UnwrapRef<R>;
    },
  };

  return [
    computed({
      get: () => status.value,
      set: value => actions.toggle(value),
    }),
    actions,
  ];
}

export default useToggle;