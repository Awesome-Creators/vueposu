// TODO:
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useTimeout from '@hooks/useTimeout';

jest.setTimeout(100000);

describe('hooks/useTimeout', () => {
  it('just callback', () => {
    mount(
      defineComponent({
        template: `<template />`,
        setup() {
          useTimeout({ cb: () => {} });
        },
      }),
    );
  });
});
