import { reactive, readonly, toRefs } from "vue-demi";
import { useEventListener } from "vueposu";
import { isServer } from "@vueposu/utils";

import type { ToRefs } from "vue-demi";

interface MouseCursorState {
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
}

const initialState: MouseCursorState = {
  pageX: 0,
  pageY: 0,
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
};

// TODO: COMMENT NEED
export function useMouse(): ToRefs<Readonly<MouseCursorState>> {
  const state = reactive(initialState);

  const moveHandler = (event: MouseEvent) => {
    const { pageX, pageY, screenX, screenY, clientX, clientY } = event;
    state.pageX = pageX;
    state.pageY = pageY;
    state.screenX = screenX;
    state.screenY = screenY;
    state.clientX = clientX;
    state.clientY = clientY;
  };

  if (!isServer) {
    useEventListener(document, "mousemove", moveHandler);
  }

  return toRefs(readonly(state));
}
