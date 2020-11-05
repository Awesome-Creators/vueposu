import { watchEffect, unref } from 'vue-demi';
import { getTargetElement } from '../libs/dom';
import { isServer } from '../libs/helper';

import type { RefTyped } from '../types/global';
import type { Target } from '../libs/dom';

const defaultEvent = 'click';

type EventType = MouseEvent | TouchEvent;

/**
 * useClickAway function
 *
 * @param target Execution handler target.
 * @param eventHandler Handler function on external click.
 * @param eventName Event trigger.
 */
function useClickAway(
  target: Target | Target[],
  eventHandler: RefTyped<(event: EventType) => void>,
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
    if (!isServer) {
      const eventNames = Array.isArray(unref(eventName))
        ? (unref(eventName) as RefTyped<string>[])
        : [eventName as RefTyped<string>];
      eventNames.map(name => document.addEventListener(unref(name), handler));

      onInvalidate(() => {
        eventNames.map(name =>
          document.removeEventListener(unref(name), handler),
        );
      });
    }
  });
}

export default useClickAway;
