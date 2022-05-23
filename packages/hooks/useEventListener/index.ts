import { unref, onMounted, watchEffect } from "vue-demi";
import { getTargetElement, isServer } from "@vueposu/utils";

import type { RefTyped, Target, TargetElement } from "@vueposu/utils";

export function useEventListener<K extends keyof WindowEventMap>(
  target: Window,
  type: RefTyped<K>,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener(
  type: RefTyped<string>,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  type: RefTyped<K>,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: RefTyped<K>,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
): void;
export function useEventListener(
  target: Target<HTMLElement | Document>,
  type: RefTyped<string>,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void;
// TODO: COMMENT NEED
export function useEventListener(...args: any) {
  let target: TargetElement | null | undefined,
    type: string,
    listener: EventListener,
    options: boolean | AddEventListenerOptions;

  const serialize = () => {
    if (typeof unref(args[0]) === "string") {
      target = window;
      type = unref(args[0]);
      listener = args[1];
      options = args[2] || false;
    } else {
      target = getTargetElement(args[0]);
      type = unref(args[1]);
      listener = args[2];
      options = args[3] || false;
    }
  };

  const register = () => {
    if (!isServer && target) {
      target.addEventListener(type, listener, options);
    }
  };

  const unregister = () => {
    if (!isServer && target) {
      target.removeEventListener(type, listener, options);
    }
  };

  onMounted(() => {
    watchEffect((onInvalidate) => {
      serialize();
      register();

      onInvalidate(unregister);
    });
  });
}
