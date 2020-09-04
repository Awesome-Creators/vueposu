import { watchEffect } from 'vue';
import { getTargetElement, Target } from '@lib/dom';

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
  eventName: string = defaultEvent,
) {
  const handler = event => {
    !(Array.isArray(target) ? target : [target]).some(t =>
      (getTargetElement(t) as HTMLElement)?.contains(event.target),
    ) && eventHandler(event);
  };

  watchEffect(onCleanup => {
    document.addEventListener(eventName, handler);

    onCleanup(() => {
      document.removeEventListener(eventName, handler);
    });
  });
}

export default useClickAway;
