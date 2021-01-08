import { defineComponent, ref } from 'vue-demi';
import { useEventListener } from 'vueposu';
import { mount } from '@vue/test-utils';
import { wait, triggerDomEvent } from '@vueposu/test-utils';

describe('dom/useEventListener', () => {
  const originalWindowAddListener = window.addEventListener.bind(window);
  const originalWindowRemoveListener = window.removeEventListener.bind(window);

  beforeEach(() => {
    window.addEventListener = originalWindowAddListener;
    window.removeEventListener = originalWindowRemoveListener;
  });

  it('should register using addEventListener on mounted, and removeEventListener automatically on unmounted, event target should be `window` by default', () => {
    let target = null;
    const addFn = jest.fn();
    const removeFn = jest.fn();

    window.addEventListener = (
      ...args: Parameters<typeof window.addEventListener>
    ) => {
      originalWindowAddListener(...args);
      addFn();
    };

    window.removeEventListener = (
      ...args: Parameters<typeof window.removeEventListener>
    ) => {
      originalWindowRemoveListener(...args);
      removeFn();
    };

    const component = mount(
      defineComponent({
        template: `<template />`,
        setup: () => {
          useEventListener('click', event => {
            target = event.target;
          });
        },
      }),
    );

    triggerDomEvent('click', window);

    component.unmount();
    expect(target).toBe(window);
    expect(addFn).toBeCalledTimes(1);
    expect(removeFn).toBeCalledTimes(1);
  });

  it('event name should can be reactive', async () => {
    const addFn = jest.fn();
    const removeFn = jest.fn();
    const eventFn = jest.fn();

    window.addEventListener = function (
      ...args: Parameters<typeof window.addEventListener>
    ) {
      originalWindowAddListener(...args);
      addFn();
    };

    window.removeEventListener = function (
      ...args: Parameters<typeof window.removeEventListener>
    ) {
      originalWindowRemoveListener(...args);
      removeFn();
    };

    const component = mount(
      defineComponent({
        template: `<template />`,
        setup: () => {
          const eventName = ref('click');
          useEventListener(eventName, eventFn);

          return {
            eventName,
          };
        },
      }),
    );

    triggerDomEvent('click', window);

    component.vm.eventName = 'mousedown';
    await wait();
    triggerDomEvent('click', window);
    triggerDomEvent('mousedown', window);

    component.unmount();
    expect(addFn).toBeCalledTimes(2);
    expect(removeFn).toBeCalledTimes(2);
    expect(eventFn).toBeCalledTimes(2);
  });

  it('should be work by set event target', () => {
    const originDocumentAddEventListener = document.addEventListener.bind(
      document,
    );
    const originDocumentRemoveEventListener = document.removeEventListener.bind(
      document,
    );

    let target = null;
    const addFn = jest.fn();
    const removeFn = jest.fn();
    const eventFn = jest.fn();

    document.addEventListener = (
      ...args: Parameters<typeof document.addEventListener>
    ) => {
      originDocumentAddEventListener(...args);
      addFn();
    };
    document.removeEventListener = (
      ...args: Parameters<typeof document.removeEventListener>
    ) => {
      originDocumentRemoveEventListener(...args);
      removeFn();
    };

    const component = mount(
      defineComponent({
        template: `<template />`,
        setup: () => {
          useEventListener(document, 'click', event => {
            target = event.target;
            eventFn();
          });
        },
      }),
    );

    triggerDomEvent('click');

    component.unmount();
    expect(target).toBe(document);
    expect(addFn).toBeCalledTimes(1);
    expect(removeFn).toBeCalledTimes(1);
    expect(eventFn).toBeCalledTimes(1);

    document.addEventListener = originDocumentAddEventListener;
    document.removeEventListener = originDocumentRemoveEventListener;
  });

  it('should throw error when `useEventListener` not be called inside of `setup()`', () => {
    expect(() => useEventListener('error', () => null)).toThrowError(
      'Invalid hook call: `useEventListener` can only be called inside of `setup()`.',
    );
  });
});
