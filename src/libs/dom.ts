/* istanbul ignore file */
import { isFunction } from './helper';

import type { Ref } from 'vue-demi';

export type Target<T = HTMLElement> =
  | T
  | null
  | (() => T | null)
  | Ref<T | null | undefined>;

type TargetElement = HTMLElement | Document | Window;

export function isHTMLElement(element) {
  return element?.nodeType === 1;
}

export function getTargetElement(
  target?: Target<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | null | undefined {
  if (!target) return defaultElement;

  const targetElement = isFunction(target)
    ? target()
    : 'value' in target
    ? target.value
    : target;

  return targetElement;
}
