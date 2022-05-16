import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import { useDebounceFn } from ".";
import { wait } from '@vueposu/test-utils';

describe('hooks/useDebounceFn', () => {
  it('test default case', async () => {
    const spy = vi.fn();
    const component = mount(
      defineComponent({
        setup() {
          const fn = useDebounceFn(spy);
          return {
            fn,
          };
        },
        template: `<template />`,
      }),
    );
    component.vm.fn();
    await wait();
    expect(spy).toHaveBeenCalledTimes(1);

    component.vm.fn();
    component.vm.fn.cancel();
    await wait();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('test common case', async () => {
    const spy = vi.fn();
    const component = mount(
      defineComponent({
        setup() {
          const fn = useDebounceFn(spy, 300);
          return {
            fn,
          };
        },
        template: `<template />`,
      }),
    );

    component.vm.fn();
    await wait();
    expect(spy).toHaveBeenCalledTimes(0);

    await wait(300);
    expect(spy).toHaveBeenCalledTimes(1);

    component.vm.fn();
    await wait(100);
    component.vm.fn();
    await wait(100);
    component.vm.fn();
    await wait(100);
    expect(spy).toHaveBeenCalledTimes(1);

    await wait(200);
    expect(spy).toHaveBeenCalledTimes(2);

    component.vm.fn();
    await wait(298);
    component.vm.fn.cancel();
    await wait(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
