import type { Ref } from 'vue-demi';

interface useThrottleEffectOptions<T extends Ref[]> {
  (listener: (prevDeps: T, currentDeps: T) => void, deps: T, wait: number);
}

export default function useThrottleEffect<T extends Ref[]>(
  options: useThrottleEffectOptions<T>,
) {}
