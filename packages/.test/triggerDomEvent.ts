// trigger dom event
export function triggerDomEvent(
  event: string,
  element: Window | Document | HTMLElement = document
) {
  const $el = element ?? document;
  $el.dispatchEvent(new Event(event));
}

