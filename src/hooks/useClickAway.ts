import { watchEffect, unref, isReactive, isRef } from 'vue-demi';
import { getTargetElement, Target } from '../libs/dom';
import type { RefTyped } from '../types/global';

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
  eventHandler: RefTyped<(event: EventType) => void>,
  target: Target | Target[],
  eventName: RefTyped<string | string[]> = defaultEvent,
): void {
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

    unref(eventHandler)(event);
  };

  watchEffect(onInvalidate => {
    const eventNames = Array.isArray(unref(eventName))
      ? (unref(eventName) as RefTyped<string>[])
      : [eventName as RefTyped<string>];
    eventNames.map(name => document.addEventListener(unref(name), handler));

    onInvalidate(() => {
      eventNames.map(name =>
        document.removeEventListener(unref(name), handler),
      );
    });
  });
}

export default useClickAway;
