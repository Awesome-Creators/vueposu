import { computed, ref } from 'vue';
import { Ref } from 'vue';

export interface StableActions<K> {
  add: (key: K) => void;
  remove: (key: K) => void;
  reset: () => void;
  has: (key: K) => boolean;
}

const useSet = <K>(
  initialSet = new Set<K>(),
): [Ref<Set<K>>, StableActions<K>] => {
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
