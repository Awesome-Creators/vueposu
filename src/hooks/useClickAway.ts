import { watchEffect } from 'vue';
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
    !(Array.isArray(target) ? target : [target]).some(t =>
      (getTargetElement(t) as HTMLElement)?.contains(event.target),
    ) && eventHandler(event);
  };

  watchEffect(onCleanup => {
    const evts = Array.isArray(eventName) ? eventName : [eventName];
    evts.map(evt => document.addEventListener(evt, handler));

    onCleanup(() => {
      evts.map(evt => document.removeEventListener(evt, handler));
    });
  });
}

export default useClickAway;
