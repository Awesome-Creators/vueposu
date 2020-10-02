import { ref } from 'vue-demi';
import type { Ref } from 'vue-demi';
import { isArray } from '../libs/helper';

export interface UseDynamicListActions<S> {
  move(to: number, from: number);
  insert(idx: number, val: S);
  insertBefore(idx: number, val: S);
  insertAfter(idx: number, val: S);
  getKey(idx: number);
  deleteByIdx(idx: number);
  replace(to: number, from: number);
  unshift(...items: S[]);
  shift();
  pop();
  push(val: S);
}

export type UseDynamicListReturnType<T, S> = [Ref<T>, UseDynamicListActions<S>];

// TODO: ...
// export interface UseDynamicListOptions {
//   sort();
//   builder(fn: Function | object, times: number);
// }

// TODO: COMMENT NEED
export default function useDynamicList<T extends Array<unknown>, S = T[number]>(
  initValue: T | undefined[] = [],
): UseDynamicListReturnType<T, S> {
  if (isArray(initValue) === false) {
    throw new Error('initValue should be a array');
  }
  const state = ref(initValue) as Ref<T>;
  const actions: UseDynamicListActions<S> = {
    move(to: number, from: number) {
      state.value.splice(to, 0, state.value.splice(from, 1)[0]);
    },
    insert(idx: number, val: S) {
      state.value.splice(idx, 0, val);
    },
    insertBefore(idx: number, val: S) {
      state.value.splice(idx, -1, val);
    },
    insertAfter(idx: number, val: S) {
      state.value.splice(idx + 1, 0, val);
    },
    // TODO: ...
    getKey(idx: number) {},
    deleteByIdx(idx: number) {
      state.value.splice(idx, 1);
    },
    replace(to: number, from: number) {
      actions.move(to, from);
    },
    unshift(...items: S[]) {
      state.value.unshift(...items);
    },
    shift() {
      state.value.shift();
    },
    pop() {
      state.value.pop();
    },
    push(val: S) {
      state.value.push(val);
    },
  };
  return [state, actions];
}
