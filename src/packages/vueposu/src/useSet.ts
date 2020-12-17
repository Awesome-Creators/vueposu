import { readonly, ref, unref, getCurrentInstance } from 'vue-demi';

import type { DeepReadonly, Ref } from 'vue-demi';
import type { RefTyped } from '@/types/global';

interface SetActions<K> {
  add: (key: K) => void;
  remove: (key: K) => void;
  has: (key: K) => boolean;
  reset: () => void;
  clear: () => void;
}

type UseSetReturnType<K> = {
  set: DeepReadonly<Ref<Set<K>>>;
} & SetActions<K>;

// TODO: COMMENT NEED
const useSet = <K = any>(
  initialSet?: RefTyped<Iterable<K>>,
): UseSetReturnType<K> => {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useSet` can only be called inside of `setup()`.',
    );
  }

  const set = ref<Set<K>>(new Set(unref(initialSet)));
  const actions = {
    add: (item: K) => {
      set.value.add(item);
    },
    remove: (item: K) => {
      set.value.delete(item);
    },
    has: (item: K) => set.value.has(item),
    reset: () => {
      set.value = new Set(unref(initialSet));
    },
    clear: () => {
      set.value.clear();
    },
  };

  return {
    set: readonly(set),
    ...actions,
  };
};

export default useSet;
