import useEffect from './useEffect';
import { getTargetElement, Target } from '@libs/dom';

const defaultEvent = 'click';

type EventType = MouseEvent | TouchEvent;

/**
 * useClickAway function
 *
 * @param eventHandler Handler function on external click.
 * @param target Execution handler target.
 * @param eventName Event trigger.
 */
function useClickAway(
  eventHandler: (event: EventType) => void,
  target: Target | Target[],
  eventName: string | string[] = defaultEvent,
) {
  const handler = event => {
    const targets = Array.isArray(target) ? target : [target];

    if (
      targets.some(targetItem => {
        const targetElement = getTargetElement(targetItem) as HTMLElement;
        return !targetElement || targetElement.contains(event.target);
      })
    ) {
      return;
    }

    eventHandler(event);
  };

  useEffect(() => {
    const evts = Array.isArray(eventName) ? eventName : [eventName];
    evts.map(evt => document.addEventListener(evt, handler));

    return () => {
      evts.map(evt => document.removeEventListener(evt, handler));
    };
  }, [eventHandler, target, eventName]);
}

export default useClickAway;
