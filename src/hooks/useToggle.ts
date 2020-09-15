import { ComputedRef } from 'vue';
import { isDef } from '../libs/helper';
import useState from './useState';

type IState = string | number | boolean | null | undefined;

interface IActions {
  setLeft: () => void;
  setRight: () => void;
  toggle: (value?: any) => void;
}

function useToggle<D = boolean | undefined>(): [ComputedRef<boolean>, IActions];

function useToggle<D = IState>(defaultValue: D): [ComputedRef<D>, IActions];

function useToggle<D = IState, R = IState>(
  defaultValue: D,
  reverseValue: R,
): [ComputedRef<D | R>, IActions];

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
        isDef(value)
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
