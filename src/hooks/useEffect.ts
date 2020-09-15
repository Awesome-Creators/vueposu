import {
  watch,
  onUpdated,
  onMounted,
  onBeforeUnmount,
  isProxy,
  isRef,
  isReactive,
} from 'vue';

type EffectCallback = () => void | (() => void | undefined);

function useEffect<T = any>(effect: EffectCallback, deps?: Readonly<Array<T>>) {
  let unmountEffect: ReturnType<EffectCallback>;
  const resolveDispatcher = () => {
    unmountEffect = effect();
  };

  if (deps) {
    deps = deps.filter(d => isProxy(d) || isRef(d) || isReactive(d));

    if (deps.length === 0) {
      onMounted(resolveDispatcher);
    } else {
      watch(deps, resolveDispatcher, {
        immediate: true,
      });
    }
  } else {
    resolveDispatcher();
    onUpdated(resolveDispatcher);
  }

  onBeforeUnmount(() => {
    unmountEffect && unmountEffect();
  });
}

export default useEffect;
