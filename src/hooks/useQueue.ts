import { ref } from 'vue-demi';

export interface QueueMethods<T> {
  add: (item: T) => void;
  remove: () => T;
  first: T;
  last: T;
  reset: () => void;
  empty: () => void;
  size: number;
}

const useQueue = <T>(initialValue: T[] = []): QueueMethods<T> => {
  const state = ref(Array.from(initialValue));
  return {
    add: value => state.value.push(value as any),
    remove: () => state.value.shift() as any,
    empty: () => {
      state.value = [];
    },
    reset: () => {
      state.value = initialValue as any;
    },
    get first() {
      return state.value[0] as any;
    },
    get last() {
      return state.value[state.value.length - 1] as any;
    },
    get size() {
      return state.value.length;
    },
  };
};

export default useQueue;
