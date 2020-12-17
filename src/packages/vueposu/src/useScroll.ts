import {
  reactive,
  readonly,
  toRefs,
  getCurrentInstance,
} from 'vue-demi';
import useEventListener from './useEventListener';
import { getTargetElement } from '@/utils/dom';

import type { Target } from '@/utils/dom';

type ScrollTarget = HTMLElement | Document;

interface ScrollState {
  x: number;
  y: number;
}

const initialState: ScrollState = {
  x: 0,
  y: 0,
};

// TODO: COMMENT NEED
export default function useScroll(target?: Target<ScrollTarget>) {
  if (!getCurrentInstance()) {
    throw new Error(
      'Invalid hook call: `useScroll` can only be called inside of `setup()`.',
    );
  }

  const state = reactive(initialState);

  const scrollHandler = (event: Event) => {
    const currentTarget = event.target;
    if (currentTarget === document) {
      state.x = document?.scrollingElement.scrollLeft;
      state.y = document?.scrollingElement.scrollTop;
    } else {
      state.x = (currentTarget as HTMLElement).scrollLeft;
      state.y = (currentTarget as HTMLElement).scrollTop;
    }
  };
  
  useEventListener((() => getTargetElement(target, document)) as Target, 'scroll', scrollHandler, {
    passive: true,
  })

  return toRefs(readonly(state));
}
