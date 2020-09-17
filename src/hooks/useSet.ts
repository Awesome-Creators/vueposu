import { isSet } from 'lodash-es';
import { reactive } from 'vue';

export interface StableActions<K> {
  add: (key: K) => void;
  remove: (key: K) => void;
  toggle: (key: K) => void;
  reset: () => void;
  has: (key: K) => boolean;
}

const useSet = <K>(initialSet = new Set<K>()): [Set<K>, StableActions<K>] => {
  let set = reactive<Set<K>>(
    isSet(initialSet) ? initialSet : new Set(initialSet),
  );
  const stableActions = {
    add: (item: K) => {
      set.add(item);
    },
    remove: (item: K) => {
      set.delete(item);
    },
    toggle: (item: K) => {
      if (set.has(item)) {
        set = reactive(new Set(Array.from(set).filter(i => i !== item)));
      } else {
        set.add(item);
      }
    },
    reset: () => {
      set = isSet(initialSet) ? initialSet : new Set(initialSet);
    },
    has: (item: K) => set.has(item),
  };
  return [set, stableActions];
};

export default useSet;
