import { ComputedRef } from 'vue';
import useState from './useState';

type IState = string | number | boolean | null | undefined;

interface IActions<T = IState> {
  setLeft: () => void;
  setRight: () => void;
  toggle: (value?: T) => void;
}

function useToggle<D = boolean | undefined>(): [
  ComputedRef<boolean>,
  IActions<D>,
];

function useToggle<D = IState>(defaultValue: D): [ComputedRef<D>, IActions<D>];

function useToggle<D = IState, R = IState>(
  defaultValue: D,
  reverseValue: R,
): [ComputedRef<D | R>, IActions<D | R>];

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

  const [status, setStatus] = useState<D | R>(defaultValue);

  const actions: IActions = {
    toggle: (value?: any) =>
      setStatus(
        value !== void 0
          ? value
          : status.value !== defaultValue
          ? defaultValue
          : reverseValue,
      ),
    setLeft: () => setStatus(defaultValue),
    setRight: () => setStatus(reverseValue),
  };

  return [status, actions];
}

export default useToggle;
