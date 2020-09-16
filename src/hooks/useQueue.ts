import useState from '../hooks/useState';

export interface QueueMethods<T> {
  add: (item: T) => void;
  remove: () => T;
  first: T;
  last: T;
  size: number;
}

const useQueue = <T>(initialValue: T[] = []): QueueMethods<T> => {
  const [state, set] = useState(initialValue);
  return {
    add: value => {
      set(queue => [...queue, value]);
    },
    remove: () => {
      let result;
      set(([first, ...rest]) => {
        result = first;
        return rest;
      });
      return result;
    },
    get first() {
      return state.value[0] as T;
    },
    get last() {
      return state.value[state.value.length - 1] as T;
    },
    get size() {
      return state.value.length;
    },
  };
};

export default useQueue;
