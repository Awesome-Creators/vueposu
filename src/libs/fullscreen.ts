/* istanbul ignore file */

// Based on Fullscreen API.
// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API

import { isHTMLElement } from './dom';

const eventsMap = <const>{
  change: 'fullscreenchange',
  error: 'fullscreenerror',
};

const getFullscreenElement = () => document.fullscreenElement;

export const request = (element: HTMLElement = document.body) => {
  const { fullscreenEnabled } = document;

  if (fullscreenEnabled) {
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
  const { exitFullscreen } = document;
  if (exitFullscreen && getFullscreenElement() === element) {
    exitFullscreen();
  }
};

export const toggle = (element: HTMLElement = document.body) => {
  getFullscreenElement() === element ? exit() : request(element);
};

export const on = (event: keyof typeof eventsMap, fn: () => void) => {
  const eventName = eventsMap[event];
  if (eventName) {
    document.addEventListener(eventName, fn, false);
  }
};

export const off = (event: keyof typeof eventsMap, fn: () => void) => {
  const eventName = eventsMap[event];
  if (eventName) {
    document.removeEventListener(eventName, fn, false);
  }
};

export default {
  getFullscreenElement,
  request,
  exit,
  toggle,
  on,
  off,
};
