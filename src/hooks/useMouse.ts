import { reactive, watchEffect, toRefs } from 'vue-demi';

interface IMouseCursorState {
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
}

const initialState: IMouseCursorState = {
  pageX: 0,
  pageY: 0,
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
};

const MOUSE_MOVE = 'mousemove';

export default function useMouse() {
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
}
