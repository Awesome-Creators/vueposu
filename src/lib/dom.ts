import { Ref } from 'vue';

export type Target<T = HTMLElement> =
  | T
  | null
  | (() => T | null)
  | Ref<T | null | undefined>;

type TargetElement = HTMLElement | Document | Window;

export function getTargetElement(
  target?: Target<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | null | undefined {
  if (!target) return defaultElement;

  const targetElement =
    typeof target === 'function'
      ? target()
      : 'value' in target
      ? target.value
      : target;

  return targetElement;
}
