import { ref, Ref, UnwrapRef } from 'vue';

type IState = string | number | boolean | null | undefined;

interface IActions<T = IState> {
  setLeft: () => T;
  setRight: () => T;
  toggle: (value?: T) => T;
}

function useToggle<D = boolean | undefined>(): [
  Ref<UnwrapRef<boolean>>,
  IActions<D>,
];

function useToggle<D = IState>(
  defaultValue: D,
): [Ref<UnwrapRef<D>>, IActions<D>];

function useToggle<D = IState, R = IState>(
  defaultValue: D,
  reverseValue: R,
): [Ref<UnwrapRef<D | R>>, IActions<D | R>];

/**
 * useToggle function
 *
 * @param defaultValue Truth value, default is true  - an optional parameter
 * @param reverseValue False value, default is false - an optional parameter
 * @returns [ status, { toggle, setLeft, setRight } ]
 */
function useToggle<D extends IState = IState, R extends IState = IState>(
  defaultValue: D = true as D,
  reverseValue?: R,
) {
  reverseValue = (reverseValue ?? !defaultValue) as R;

  const status = ref<D | R>(defaultValue);

  const actions: IActions = {
    toggle: (value?: any) =>
      (status.value =
        value !== void 0
          ? value
          : status.value !== defaultValue
          ? defaultValue
          : reverseValue),
    setLeft: () => (status.value = defaultValue as UnwrapRef<D>),
    setRight: () => (status.value = reverseValue as UnwrapRef<R>),
  };

  return [status, actions];
}

export default useToggle;
