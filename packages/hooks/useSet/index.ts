import { readonly, ref, unref } from 'vue-demi';

import type { DeepReadonly, Ref } from 'vue-demi';
import type { RefTyped } from '@vueposu/utils';

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
export function useSet<K = any>(
  initialSet?: RefTyped<Iterable<K>>,
): UseSetReturnType<K> {
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
}