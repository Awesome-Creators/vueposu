import { shallowRef } from 'vue';

type SetStateAction<S> = [S, (action: S | ((prevState: S) => S)) => S];

function useState<S>(initialState: S): SetStateAction<S> {
  const state = shallowRef(
    typeof initialState === 'function' ? initialState() : initialState,
  );

  const dispatcher = (action: S) => {
    return (state.value =
      typeof action === 'function' ? action(state.value) : action);
  };

  return [state.value, dispatcher];
}

export default useState;
