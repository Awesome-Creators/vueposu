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
  const [state, setState] = useState(initState);

  const moveHandler = (event: MouseEvent) => {
    const { pageX, pageY, screenX, screenY, clientX, clientY } = event;
    setState({ pageX, pageY, screenX, screenY, clientX, clientY });
  };

  useEffect(() => {
    document.addEventListener(MOUSE_MOVE, moveHandler);

    return () => {
      document.removeEventListener(MOUSE_MOVE, moveHandler);
    };
  }, []);

  return state;
}
