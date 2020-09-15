import { computed, ref, ComputedRef, UnwrapRef } from 'vue';

export type Dispatch<A> = (value: A) => void;
type Reducer<S, A> = (prevState: S, action: A) => S;

/**
 * An alternative to `useState`.
 * useReducer just like React-style.
 *
 * @param reducer
 * @param initializerArg
 * @param initializer
 */
function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initializerArg: I,
  initializer?: (arg?: I) => UnwrapRef<I>,
): [ComputedRef<UnwrapRef<I>>, Dispatch<Parameters<R>[1]>] {
  const state = ref(initializerArg);

  if (initializer && typeof initializer === 'function') {
    state.value = initializer(initializerArg);
  }

  const reducerState = computed(() => state.value);

  return [
    reducerState,
    action => (state.value = reducer(reducerState.value, action)),
  ];
}

export default useReducer;
