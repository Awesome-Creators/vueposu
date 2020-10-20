import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import useClipboard from '@hooks/useClipboard';
import { triggerDomEvent, wait } from '../../utils/helper';

let copy = '';

Object.assign(navigator, {
  clipboard: {
    writeText: (input: string) => {
      copy = input;
    },
    readText: () => {
      return copy;
    },
  },
});

describe('hooks/useClipboard', () => {
  navigator.clipboard.writeText('a');

  it('test copy', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const { copy, text, supportCopy } = useClipboard();
          return {
            copy,
            text,
            supportCopy,
          };
        },
      }),
    );

    await wait();
    expect(component.vm.text).toBe('a');

    // mock copy text
    component.vm.copy('b');
    await wait();
    expect(component.vm.text).toBe('b');

    navigator.clipboard.writeText('c');
    triggerDomEvent('copy', window);
    await wait();
    expect(component.vm.text).toBe('c');

    triggerDomEvent('visibilitychange', window);
    navigator.clipboard.writeText('d');
    triggerDomEvent('focus', window);
    await wait();
    expect(component.vm.text).toBe('d');
  });

  it('should throw error when `useClipboard` not be called inside of `setup()`', () => {
    expect(() => useClipboard()).toThrowError(
      'Invalid hook call: `useClipboard` can only be called inside of `setup()`.',
    );
  });
});
