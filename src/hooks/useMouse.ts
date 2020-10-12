import { reactive, watchEffect, toRefs, getCurrentInstance } from 'vue-demi';

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

const MOUSE_MOVE = 'mousemove';

// TODO: COMMENT NEED
export default function useMouse() {
  if (getCurrentInstance()) { 
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

    watchEffect(onInvalidate => {
      document.addEventListener(MOUSE_MOVE, moveHandler);

      onInvalidate(() => {
        document.removeEventListener(MOUSE_MOVE, moveHandler);
      });
    });

    return toRefs(state);
  } else {
    throw new Error(
      'Invalid hook call: `useMouse` can only be called inside of `setup()`.',
    );
  }
}
