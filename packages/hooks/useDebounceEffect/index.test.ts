import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import { useDebounceEffect } from ".";
import { wait } from '@vueposu/test-utils';

describe('hooks/useDebounceEffect', () => {
  it('test without wait', async () => {
    const fn = vi.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const count = ref(1);
          const inc = () => count.value++;
          useDebounceEffect(fn, count);
          return {
            count,
            inc,
          };
        },
      }),
    );

    component.vm.inc();
    await wait();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0]).toEqual([2, 1]);

    component.vm.inc();
    await wait();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn.mock.calls[1]).toEqual([3, 2]);

    component.vm.inc();
    await wait();
    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn.mock.calls[2]).toEqual([4, 3]);
  });

  it('test wait', async () => {
    const fn = vi.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const count = ref(1);
          const inc = () => count.value++;
          const wait = ref(300);
          useDebounceEffect(fn, count, wait);

          return {
            count,
            inc,
            wait,
          };
        },
      }),
    );

    component.vm.inc();
    await wait();
    expect(fn).toHaveBeenCalledTimes(0);

    await wait(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0]).toEqual([2, 1]);

    component.vm.wait = 400;
    component.vm.inc();
    await wait();
    await wait(300);
    expect(fn).toHaveBeenCalledTimes(1);

    await wait(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn.mock.calls[1]).toEqual([3, 2]);
  });

  it('test wait interrupt', async () => {
    const fn = vi.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const count = ref(1);
          const inc = () => count.value++;
          useDebounceEffect(fn, count, 300);

          return {
            count,
            inc,
          };
        },
      }),
    );

    component.vm.inc();
    await wait();
    expect(fn).toHaveBeenCalledTimes(0);

    await wait(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn.mock.calls[0]).toEqual([2, 1]);

    component.vm.inc();
    await wait(150);
    component.vm.inc();
    await wait(150);
    expect(fn).toHaveBeenCalledTimes(1);

    await wait(300);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn.mock.calls[1]).toEqual([4, 3]);
  });
});
