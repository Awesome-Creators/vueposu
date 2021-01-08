import { ref } from 'vue-demi';

// TODO: COMMENT NEED
export interface QueueMethodsReturnType<T> {
  add: (item: T) => void;
  remove: () => T;
  first: T;
  last: T;
  reset: () => void;
  empty: () => void;
  size: number;
}

export function useQueue<T>(initialValue: T[] = []): QueueMethodsReturnType<T> {
  const state = ref<T[]>(Array.from(initialValue));
  return {
    add: value => state.value.push(value as any),
    remove: () => state.value.shift() as any,
    empty: () => {
      state.value = [];
    },
    reset: () => {
      state.value = Array.from(initialValue) as any;
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