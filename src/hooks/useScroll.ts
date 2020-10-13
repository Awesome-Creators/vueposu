import {
  reactive,
  readonly,
  onMounted,
  onBeforeUnmount,
  toRefs,
  getCurrentInstance,
} from 'vue-demi';
import { getTargetElement } from '../libs/dom';

import type { Target } from '../libs/dom';

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
  if (getCurrentInstance()) {
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
    
    let targetElement;
    onMounted(() => {
      targetElement = getTargetElement(target, document);
      targetElement.addEventListener('scroll', scrollHandler);
    });
    onBeforeUnmount(() => {
      targetElement.removeEventListener('scroll', scrollHandler);
    });

    return toRefs(readonly(state));
  } else {
    throw new Error(
      'Invalid hook call: `useScroll` can only be called inside of `setup()`.',
    );
  }
}
