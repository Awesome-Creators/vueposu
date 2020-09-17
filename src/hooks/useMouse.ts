import useEffect from './useEffect';
import useState from './useState';

interface IMouseCursorState {
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
  clientX: number;
  clientY: number;
}

const initState: IMouseCursorState = {
  pageX: 0,
  pageY: 0,
  screenX: 0,
  screenY: 0,
  clientX: 0,
  clientY: 0,
};

const MOUSE_MOVE = 'mousemove';

export default function useMouse() {
  const [pageX, setPageX] = useState(initState.pageX);
  const [pageY, setPageY] = useState(initState.pageY);
  const [screenX, setScreenX] = useState(initState.screenX);
  const [screenY, setScreenY] = useState(initState.screenY);
  const [clientX, setClientX] = useState(initState.clientX);
  const [clientY, setClientY] = useState(initState.clientY);

  const moveHandler = (event: MouseEvent) => {
    setPageX(event.pageX);
    setPageY(event.pageY);
    setScreenX(event.screenX);
    setScreenY(event.screenY);
    setClientX(event.clientX);
    setClientY(event.clientY);
  };

  useEffect(() => {
    document.addEventListener(MOUSE_MOVE, moveHandler);

    return () => {
      document.removeEventListener(MOUSE_MOVE, moveHandler);
    };
  }, []);

  return {
    pageX,
    pageY,
    screenX,
    screenY,
    clientX,
    clientY,
  };
}
