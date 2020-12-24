import { ref, watch, onUnmounted, getCurrentInstance } from 'vue-demi';
import { isFunction } from '@vueposu/shared';

type Listener = (...stream) => void;

// TODO: COMMENT NEED
export function useEventEmitter() {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useEventEmitter` can only be called inside of `setup()`.',
    );
  }

  const emitID = ref(0);
  const stream = ref([]);

  const subscriptions = new Set<Listener>();

  const emit = (...args) => {
    emitID.value++;
    stream.value = args;
  };

  const on = (listener: Listener) => {
    if (isFunction(listener)) {
      subscriptions.add(listener);
    }
  };

  watch(
    emitID,
    () => {
      for (let listener of subscriptions) {
        listener(...stream.value);
      }
    },
    {
      flush: 'post',
    },
  );

  onUnmounted(() => {
    subscriptions.clear();
  });

  return { emit, on };
}
