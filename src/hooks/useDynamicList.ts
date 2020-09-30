import { ref } from 'vue-demi';
import type { Ref } from 'vue-demi';
import { isArray, isUndef } from '../libs/helper';

export interface UseDynamicListActions<T extends Array<S>, S> {
  move(idx: number, idx2: number);
  insert(idx: number);
  insertBefore(idx: number);
  insertAfter(idx: number);
  getKey(idx: number);
  deleteByIdx(idx: number);
  replace(idx: number, idx2: number);
  sortList();
  filterList();
  resetList();
  unshift(item: T);
  map();
  shift();
  pop();
  reduce();
  push(val: S);
}

export type UseDynamicListReturnType<T extends Array<S>, S> = [
  Ref<T>,
  UseDynamicListActions<T, S>,
];

export interface UseDynamicListOptions {
  sort();
  builder(fn: Function | object, times: number);
}

// TODO:
// getKey ..
// move
// insert
// TODO: COMMENT NEED

export default function useDynamicList<T extends Array<S>, S>(
  initValue: T | undefined[] = [],
): UseDynamicListReturnType<T, S> {
  if (isArray(initValue) === false) {
    throw new Error('initValue should be a array');
  }
  const state = ref(initValue) as Ref<T>;
  const actions: UseDynamicListActions<T, S> = {
    move(idx: number, idx2: number) {},
    insert(idx: number) {},
    insertBefore(idx: number) {},
    insertAfter(idx: number) {},
    getKey(idx: number) {},
    deleteByIdx(idx: number) {
      state.value.splice(idx, 1);
    },
    replace(idx: number, idx2: number) {},
    sortList() {
      return state.value.sort((a, b) => Number(a) - Number(b));
    },
    filterList() {},
    resetList() {},
    unshift() {},
    map() {},
    shift() {
      state.value.shift();
    },
    pop() {
      state.value.pop();
    },
    reduce() {},
    push(val: S) {
      state.value.push(val);
    },
  };
  return [state, actions];
}
