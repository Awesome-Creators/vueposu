import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { useClipboard } from ".";
import { triggerDomEvent, wait } from '@vueposu/test-utils';

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
          const { copy, text, supported } = useClipboard();
          return {
            copy,
            text,
            supported,
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
});
