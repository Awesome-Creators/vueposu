import { unref, onMounted, watchEffect, getCurrentInstance } from 'vue-demi';
import { getTargetElement, isServer } from '@vueposu/shared';

import type { RefTyped } from '@vueposu/shared';
import type { Target } from '@vueposu/shared';

export function useEventListener<K extends keyof WindowEventMap>(
  target: Window,
  type: RefTyped<K>,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener(
  type: RefTyped<string>,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  target: Document,
  type: RefTyped<K>,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  type: RefTyped<K>,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void;
export function useEventListener(
  target: Target<HTMLElement | Document>,
  type: RefTyped<string>,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
): void;

// TODO: COMMENT NEED
export function useEventListener(...args) {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useEventListener` can only be called inside of `setup()`.',
    );
  }

  let target, type, listener, options;

  const serialize = () => {
    if (typeof unref(args[0]) === 'string') {
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
    watchEffect(onInvalidate => {
      serialize();
      register();

      onInvalidate(unregister);
    });
  });
}
