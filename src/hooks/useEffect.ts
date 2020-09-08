import {
  watch,
  watchEffect,
  onMounted,
  onBeforeUnmount,
  WatchSource,
} from 'vue';

type EffectCallback = () => void | (() => void);

function useEffect(
  effect: EffectCallback,
  deps?: Readonly<Array<WatchSource<unknown> | object>>,
) {
  let unmountEffect;
  const resolveDispatcher = () => {
    unmountEffect = effect();
  };

  if (deps) {
    if (deps.length === 0) {
      onMounted(resolveDispatcher);
    } else {
      watch(deps, resolveDispatcher, {
        immediate: true,
      });
    }
  } else {
    watchEffect(resolveDispatcher);
  }

  onBeforeUnmount(() => {
    unmountEffect && unmountEffect();
  });
}

export default useEffect;
