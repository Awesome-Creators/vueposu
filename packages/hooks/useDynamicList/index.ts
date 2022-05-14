import { ref } from "vue-demi";
import { isArray } from "@vueposu/utils";

import type { Ref } from "vue-demi";

export interface UseDynamicListActions<S> {
  move(to: number, from: number): void;
  insert(index: number, n: S): void;
  insertBefore(index: number, n: S): void;
  insertAfter(index: number, val: S): void;
  // getKey(index: number): void;
  remove(index: number): void;
  replace(to: number, from: number): void;
  unshift(...items: S[]): void;
  shift(): void;
  pop(): void;
  push(val: S): void;
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
  initValue: T | undefined[] = []
): UseDynamicListReturnType<T, S> {
  if (isArray(initValue) === false) {
    throw new Error("initValue should be a array");
  }
  const list = ref(initValue) as Ref<T>;
  const actions: UseDynamicListActions<S> = {
    move(to: number, from: number) {
      list.value.splice(to, 0, list.value.splice(from, 1)[0]);
    },
    insert(index: number, val: S) {
      list.value.splice(index, 0, val);
    },
    insertBefore(index: number, val: S) {
      list.value.splice(index, -1, val);
    },
    insertAfter(index: number, val: S) {
      list.value.splice(index + 1, 0, val);
    },
    // TODO: ...
    // getKey(index: number) {},
    remove(index: number) {
      list.value.splice(index, 1);
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
