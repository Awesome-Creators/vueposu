/* istanbul ignore file */

// Based on Fullscreen API.
// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API

import { isFunction, isServer, isHTMLElement } from '@vueposu/utils';

const eventsMap = <const>{
  change: 'fullscreenchange',
  error: 'fullscreenerror',
};

export const getFullscreenElement = () =>
  isServer ? null : document.fullscreenElement;

export const request = (element: HTMLElement = document.body) => {
  if (!isServer && document.fullscreenEnabled) {
    if (isHTMLElement(element) && element.requestFullscreen) {
      element.requestFullscreen();
    } else {
      throw new Error(
        `Invalid assignment: expected a DOM Element but got: ${typeof element}`,
      );
    }
  } else {
    throw new Error(
      'Invalid call: cannot request fullscreen right now because fullscreen is disabled.',
    );
  }
};

export const exit = (element: HTMLElement = document.body) => {
  if (
    !isServer &&
    isFunction(document.exitFullscreen) &&
    getFullscreenElement() === element
  ) {
    document.exitFullscreen();
  }
};

export const toggle = (element: HTMLElement = document.body) => {
  !isServer && getFullscreenElement() === element ? exit() : request(element);
};

export const on = (event: keyof typeof eventsMap, fn: () => void) => {
  const eventName = eventsMap[event];
  if (eventName && !isServer) {
    document.addEventListener(eventName, fn, false);
  }
};

export const off = (event: keyof typeof eventsMap, fn: () => void) => {
  const eventName = eventsMap[event];
  if (eventName && !isServer) {
    document.removeEventListener(eventName, fn, false);
  }
};