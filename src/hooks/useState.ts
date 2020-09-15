import { ComputedRef } from 'vue';
import { isFunction } from '../libs/helper';
import useReducer, { Dispatch } from './useReducer';

type DispatchType<S> = S | ((prevState: S) => S);
type SetStateAction<S> = [ComputedRef<S>, Dispatch<DispatchType<S>>];

/**
 * Returns a stateful value, and a function to update it.
 * useState just like React-style.
 *
 * @param initialState The initial state.
 */

function useState<S>(initialState: S | (() => S)): SetStateAction<S> {
  const [state, dispatch] = useReducer(
    (_, nextState) => nextState,
    isFunction(initialState) ? initialState() : initialState,
  );

  return [
    isFunction(state) ? state() : state,
    action => {
      dispatch(isFunction(action) ? (action as Function)(state.value) : action);
    },
  ];
}

export default useState;
