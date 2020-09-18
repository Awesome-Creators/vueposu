import { reactive } from 'vue-demi';

export interface QueueMethods<T> {
  add: (item: T) => void;
  remove: () => T;
  first: T;
  last: T;
  size: number;
}

const useQueue = <T>(initialValue: T[] = []): QueueMethods<T> => {
  const state = reactive(initialValue);
  return {
    add: value => state.push(value as any),
    remove: () => state.shift() as any,
    get first() {
      return state[0] as any;
    },
    get last() {
      return state[state.length - 1] as any;
    },
    get size() {
      return state.length;
    },
  };
};

export default useQueue;
