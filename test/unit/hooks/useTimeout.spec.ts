import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useTimeout from '@hooks/useTimeout';
import { wait } from '../../utils/helper';


describe('hooks/useTimeout', () => {
  it('just callback', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const [active, start, stop] = useTimeout({ cb: fn });
          return {
            active,
            start,
            stop,
          };
        },
      }),
    );
  // TODO: ...
  });

  it('immediateStart = false', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const [active, start, stop] = useTimeout({
            cb: fn,
            immediateStart: false,
          });
          return {
            active,
            start,
            stop,
          };
        },
      }),
    );
    // TODO: ...
  });
});
