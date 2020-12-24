/* istanbul ignore file */

import { ref, unref, computed, watch, getCurrentInstance } from 'vue-demi';
import { fullscreen, isDef, isFunction, isHTMLElement } from '@vueposu/shared';

import type { Ref } from 'vue-demi';
import type { Target, RefTyped } from '@vueposu/shared';

type UseFullscreenReturnType = {
  isFullscreen: Ref<boolean>;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: (status?: RefTyped<boolean>) => void;
};

// TODO: COMMENT NEED
export function useFullscreen(
  target: Target,
  onFullscreenStatusChange?: () => void,
): UseFullscreenReturnType {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useFullscreen` can only be called inside of `setup()`.',
    );
  }

  const isFullscreen = ref(false);

  let element = null;
  watch(target, (_, __, onInvalidate) => {
    element = unref(isFunction(target) ? target() : target);
    const eventListener = () => {
      isFullscreen.value = fullscreen.getFullscreenElement() === element;
      onFullscreenStatusChange && onFullscreenStatusChange();
    };
    fullscreen.on('change', eventListener);
    onInvalidate(() => {
      fullscreen.off('change', eventListener);
    });
  });

  const toggleFullscreen = status => {
    isFullscreen.value = isDef(status)
      ? Boolean(unref(status))
      : !isFullscreen.value;
  };
  watch(isFullscreen, status => {
    if (isHTMLElement(element)) {
      status ? fullscreen.request(element) : fullscreen.exit(element);
    } else {
      throw new Error(
        `Invalid assignment: expected a DOM Element but got: ${typeof target}`,
      );
    }
  });

  return {
    isFullscreen: computed({
      get: () => isFullscreen.value,
      set: status => (isFullscreen.value = Boolean(unref(status))),
    }),
    enterFullscreen: () => toggleFullscreen(true),
    exitFullscreen: () => toggleFullscreen(false),
    toggleFullscreen,
  };
}
