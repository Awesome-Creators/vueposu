export interface UseDynamicListActions<T> {
  move(idx: number, idx2: number);
  insert(idx: number);
  insertBefore(idx: number);
  insertAfter(idx: number);
  getKey(idx: number);
  delete(idx: number);
  replace(idx: number, idx2: number);
  sortList();
  filterList();
  resetList();
  unshift(item: T);
  map();
  shift();
  pop();
}

export type UseDynamicList = [number];

export interface UseDynamicListOptions {
  sort();
  builder(fn: Function | object, times: number);
}

// TODO:
// getKey ..
// move
// insert
// TODO: COMMENT NEED

export default function useDynamicList() {}
