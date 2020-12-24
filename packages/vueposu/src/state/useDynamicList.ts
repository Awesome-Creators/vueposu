import { ref } from 'vue-demi';
import { isArray } from '@vueposu/shared';

import type { Ref } from 'vue-demi';

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

export type UseDynamicListReturnType<T, S> = {
  list: Ref<T>;
} & UseDynamicListActions<S>;

// TODO: ...
// export interface UseDynamicListOptions {
//   sort();
//   builder(fn: Function | object, times: number);
// }

// TODO: COMMENT NEED
export function useDynamicList<T extends Array<unknown>, S = T[number]>(
  initValue: T | undefined[] = [],
): UseDynamicListReturnType<T, S> {
  if (isArray(initValue) === false) {
    throw new Error('initValue should be a array');
  }
  const list = ref(initValue) as Ref<T>;
  const actions: UseDynamicListActions<S> = {
    move(to: number, from: number) {
      list.value.splice(to, 0, list.value.splice(from, 1)[0]);
    },
    insert(idx: number, val: S) {
      list.value.splice(idx, 0, val);
    },
    insertBefore(idx: number, val: S) {
      list.value.splice(idx, -1, val);
    },
    insertAfter(idx: number, val: S) {
      list.value.splice(idx + 1, 0, val);
    },
    // TODO: ...
    getKey(idx: number) {},
    deleteByIdx(idx: number) {
      list.value.splice(idx, 1);
    },
    replace(to: number, from: number) {
      actions.move(to, from);
    },
    unshift(...items: S[]) {
      list.value.unshift(...items);
    },
    shift() {
      list.value.shift();
    },
    pop() {
      list.value.pop();
    },
    push(val: S) {
      list.value.push(val);
    },
  };
  return {
    list,
    ...actions,
  };
}
