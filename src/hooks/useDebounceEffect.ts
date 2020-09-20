import type { Ref } from 'vue-demi';

interface useDebounceEffectOptions<T extends Ref[]> {
  (listener: (prevDeps: T, currentDeps: T) => void, deps: T, wait: number);
}

export default function useDebounceEffect<T extends Ref[]>(
  options: useDebounceEffectOptions<T>,
) {}
