/* istanbul ignore file */
import { unref } from "vue-demi";
import { isFunction } from "@vueposu/utils";

import type { Ref } from "vue-demi";

export type Target<T = HTMLElement> =
  | T
  | null
  | (() => T | null)
  | Ref<T | null | undefined>;

export type TargetElement = HTMLElement | Element | Document | Window;

export function isHTMLElement(element: Exclude<TargetElement, Window>) {
  return element?.nodeType === 1;
}

export function getTargetElement(
  target?: Target<TargetElement>,
  defaultElement?: TargetElement
): TargetElement | null | undefined {
  if (!target) return defaultElement;

  const targetElement = isFunction(target) ? target() : unref(target);

  return targetElement;
}
