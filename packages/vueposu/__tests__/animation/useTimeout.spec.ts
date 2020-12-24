import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import { useTimeout } from 'vueposu';
import { wait } from '@vueposu/test-utils';

describe('animation/useTimeout', () => {
  it('just callback', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const { isActive } = useTimeout(fn);
          return {
            isActive,
          };
        },
      }),
    );

    expect(component.vm.isActive).toBe(true);

    await wait(1100);
    expect(component.vm.isActive).toBe(false);
  });

  it('immediateStart = false', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const { isActive, start, stop } = useTimeout(fn, 0, false);
          return {
            isActive,
            start,
            stop,
          };
        },
      }),
    );

    expect(component.vm.isActive).toBe(false);

    component.vm.start();
    expect(component.vm.isActive).toBe(true);

    await wait(1100);
    expect(component.vm.isActive).toBe(false);

    component.vm.start();
    expect(component.vm.isActive).toBe(true);

    component.vm.stop();
    expect(component.vm.isActive).toBe(false);

    await wait(1100);
    expect(component.vm.isActive).toBe(false);
  });

  it('should throw error when `useTimeout` not be called inside of `setup()`', () => {
    expect(() => useTimeout(() => {})).toThrowError(
      'Invalid hook call: `useTimeout` can only be called inside of `setup()`.',
    );
  });
});
