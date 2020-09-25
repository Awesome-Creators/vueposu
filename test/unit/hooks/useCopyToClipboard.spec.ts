import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import useCopyToClipboard from '@hooks/useCopyToClipboard';
import { wait } from '../../utils/helper';

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

describe('hooks/useCopyToClipboard', () => {
  it('test copy', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const [copy, text, supportCopy] = useCopyToClipboard();
          return {
            copy,
            text,
            supportCopy,
          };
        },
      }),
    );

    // mock copy text
    component.vm.copy('test');

    await wait();
    expect(component.vm.text).toBe('test');

    // test unmount
  });
});
