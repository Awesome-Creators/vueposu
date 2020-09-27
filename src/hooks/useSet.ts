import { computed, ref } from 'vue-demi';
import { Ref } from 'vue-demi';

// TODO: COMMENT NEED
export interface StableActions<K> {
  add: (key: K) => void;
  remove: (key: K) => void;
  reset: () => void;
  has: (key: K) => boolean;
}

type UseSetReturnType<K> = [Ref<Set<K>>, StableActions<K>];

const useSet = <K>(initialSet = new Set<K>()): UseSetReturnType<K> => {
  let set = ref<Set<K>>(new Set(initialSet));
  const stableActions = {
    add: (item: K) => {
      set.value.add(item);
    },
    remove: (item: K) => {
      set.value.delete(item);
    },
    reset: () => {
      set.value = new Set(initialSet);
    },
    has: (item: K) => set.value.has(item),
  };
  return [computed(() => set.value), stableActions];
};

export default useSet;
