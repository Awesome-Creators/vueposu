import { computed, ref } from 'vue';

type Dispatch<A> = (value: A) => void;
type DispatchType<S> = S | ((prevState: S) => S);
type SetStateAction<S> = [S, Dispatch<DispatchType<S>>];

/**
 * Returns a stateful value, and a function to update it.
 * useState just like React-style.
 *
 * @param initialState The initial state.
 */

function useState<S>(initialState: S): SetStateAction<S> {
  const state = ref(
    typeof initialState === 'function' ? initialState() : initialState,
  );

  const dispatcher: Dispatch<DispatchType<S>> = action => {
    state.value =
      typeof action === 'function' ? (action as Function)(state.value) : action;
  };

  const $val = computed(() => state.value);

  $val.valueOf = () => $val.value;

  return [($val as unknown) as S, dispatcher];
}

export default useState;
