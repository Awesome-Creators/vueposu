import { computed, ref, ComputedRef } from 'vue';
import isFunction from 'lodash.isfunction';

type Dispatch<A> = (value: A) => void;
type DispatchType<S> = S | ((prevState: S) => S);
type SetStateAction<S> = [ComputedRef<S>, Dispatch<DispatchType<S>>];

/**
 * Returns a stateful value, and a function to update it.
 * useState just like React-style.
 *
 * @param initialState The initial state.
 */

function useState<S>(initialState: S): SetStateAction<S> {
  const state = ref(isFunction(initialState) ? initialState() : initialState);

  const dispatcher: Dispatch<DispatchType<S>> = action => {
    state.value = isFunction(action)
      ? (action as Function)(state.value)
      : action;
  };

  return [computed(() => state.value), dispatcher];
}

export default useState;
