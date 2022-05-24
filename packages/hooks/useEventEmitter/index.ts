import { ref, watch, onUnmounted } from "vue-demi";
import { isFunction } from "@vueposu/utils";

type Listener = (...stream: any[]) => void;

type UseEventEmitterReturnType = {
  emit: (...args: any[]) => void;
  on: (listener: Listener) => void;
};

// TODO: COMMENT NEED
export function useEventEmitter(): UseEventEmitterReturnType {
  const emitID = ref(0);
  const stream = ref<any[]>([]);

  const subscriptions = new Set<Listener>();

  const emit = (...args: any[]) => {
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
      flush: "post",
    }
  );

  onUnmounted(() => {
    subscriptions.clear();
  });

  return { emit, on };
}
