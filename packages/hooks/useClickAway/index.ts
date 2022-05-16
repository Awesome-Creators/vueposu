import { watchEffect, unref } from "vue-demi";
import { getTargetElement, isServer } from "@vueposu/utils";

import type { RefTyped } from "@vueposu/utils";
import type { Target } from "@vueposu/utils";

const defaultEvent = "click";

type EventType = MouseEvent | TouchEvent;

/**
 * useClickAway function
 *
 * @param target Execution handler target.
 * @param eventHandler Handler function on external click.
 * @param eventName Event trigger. default `click`.
 */
export function useClickAway(
  target: Target | Target[],
  eventHandler: RefTyped<(event: EventType) => void>,
  eventName: RefTyped<string | string[]> = defaultEvent
): void {
  const handler: EventListener = (event) => {
    const targets = Array.isArray(target) ? target : [target];

    if (
      targets.some((targetItem) => {
        const targetElement = getTargetElement(targetItem) as HTMLElement;
        return !targetElement || targetElement.contains(event?.["target"] as HTMLElement);
      })
    ) {
      return;
    }

    unref(eventHandler)(event as EventType);
  };

  watchEffect((onInvalidate) => {
    if (!isServer) {
      const eventNames = Array.isArray(unref(eventName))
        ? (unref(eventName) as RefTyped<string>[])
        : [eventName as RefTyped<string>];
      eventNames.map((name) => document.addEventListener(unref(name), handler));

      onInvalidate(() => {
        eventNames.map((name) =>
          document?.removeEventListener(unref(name), handler)
        );
      });
    }
  });
}
