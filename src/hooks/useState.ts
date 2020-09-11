import { ComputedRef } from 'vue';
import useReducer, { Dispatch } from './useReducer';

type DispatchType<S> = S | ((prevState: S) => S);
type SetStateAction<S> = [ComputedRef<S>, Dispatch<DispatchType<S>>];

/**
 * Returns a stateful value, and a function to update it.
 * useState just like React-style.
 *
 * @param initialState The initial state.
 */

function useState<S>(initialState: S): SetStateAction<S> {
  const [state, dispatch] = useReducer(
    (prevState, nextState) => (prevState === nextState ? prevState : nextState),
    typeof initialState === 'function' ? initialState() : initialState,
  );

  return [
    state,
    action => {
      dispatch(
        typeof action === 'function' ? (action as Function)(state.value) : action,
      );
    },
  ];
}

export default useState;
