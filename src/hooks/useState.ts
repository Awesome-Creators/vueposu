import { ref } from 'vue';

type Dispatch<A> = (value: A) => void;
type DispatchType<S> = S | ((prevState: S) => S);
type SetStateAction<S> = [S, Dispatch<DispatchType<S>>];

function useState<S>(initialState: S): SetStateAction<S> {
  let state = ref(
    typeof initialState === 'function' ? initialState() : initialState,
  );

  const setState: Dispatch<DispatchType<S>> = action => {
    // console.log('action', JSON.stringify(action.value as any));
    state.value =
      typeof action === 'function' ? (action as Function)(state.value) : action;
  };

  const $proxy = state;

  $proxy.valueOf = () => state.value;

  return [$proxy, setState];
}

export default useState;
