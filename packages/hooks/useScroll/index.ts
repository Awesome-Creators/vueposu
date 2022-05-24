import { reactive, readonly, toRefs } from "vue-demi";
import { useEventListener } from "vueposu";
import { getTargetElement } from "@vueposu/utils";

import type { ToRefs } from "vue-demi";
import type { Target } from "@vueposu/utils";

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
export function useScroll(
  target?: Target<ScrollTarget>
): ToRefs<Readonly<ScrollState>> {
  const state = reactive(initialState);

  const scrollHandler = (event: Event) => {
    const currentTarget = event.target;
    if (currentTarget === document) {
      state.x = document?.scrollingElement?.scrollLeft || 0;
      state.y = document?.scrollingElement?.scrollTop || 0;
    } else {
      state.x = (currentTarget as HTMLElement)?.scrollLeft || 0;
      state.y = (currentTarget as HTMLElement)?.scrollTop || 0;
    }
  };

  useEventListener(
    (() => getTargetElement(target, document)) as Target,
    "scroll",
    scrollHandler,
    {
      passive: true,
    }
  );

  return toRefs(readonly(state));
}
