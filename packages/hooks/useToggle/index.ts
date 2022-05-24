import { ref, unref, computed } from 'vue-demi';
import { isDef } from '@vueposu/utils';

import type { UnwrapRef, Ref } from 'vue-demi';
import type { RefTyped } from '@vueposu/utils';

type UseToggleState = string | number | boolean | null | undefined;

interface UseToggleActions {
  setLeft: () => void;
  setRight: () => void;
  toggle: (value?: any) => void;
}

type UseToggleReturnType<D, R> = {
  state: Ref<UnwrapRef<D> | UnwrapRef<R>>;
} & UseToggleActions;

/**
 * useToggle function
 *
 * @param defaultValue Truth value, default is `true`  - an optional parameter
 * @param reverseValue False value, default is `false` - an optional parameter
 * 
 * @returns { status, toggle, setLeft, setRight } ]
 */
export function useToggle<
  D extends RefTyped<UseToggleState>,
  R extends RefTyped<UseToggleState>
>(defaultValue?: D, reverseValue?: R): UseToggleReturnType<D, R> {
  const getDefault = () =>
    (isDef(unref(defaultValue)) ? unref(defaultValue) : true) as D;
  const getReverse = () =>
    (isDef(unref(reverseValue)) ? unref(reverseValue) : !getDefault()) as R;

  const state = ref<D | R>(getDefault());

  const toggle = (value?: any) => {
    state.value = isDef(unref(value))
      ? unref(value)
      : state.value !== getDefault()
      ? getDefault()
      : getReverse();
  };
  const setLeft = () => {
    state.value = getDefault() as UnwrapRef<D>;
  };
  const setRight = () => {
    state.value = getReverse() as UnwrapRef<R>;
  };

  return {
    state: computed({
      get: () => state.value,
      set: value => toggle(value),
    }),
    setLeft,
    setRight,
    toggle,
  };
}