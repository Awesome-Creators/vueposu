/* istanbul ignore file */
import { isRef, unref } from 'vue-demi';
import { isFunction } from './helper';

import type { Ref } from 'vue-demi';

export type Target<T = HTMLElement> =
  | T
  | null
  | (() => T | null)
  | Ref<T | null | undefined>;

type TargetElement = HTMLElement | Element | Document | Window;

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
    : isRef(target)
    ? unref(target)
    : target;

  return targetElement;
}
