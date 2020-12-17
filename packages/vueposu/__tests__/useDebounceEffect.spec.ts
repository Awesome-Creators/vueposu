import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useDebounceEffect from '../src/useDebounceEffect';
import { wait } from '@vueposu/shared/utils/helper';

describe('hooks/useDebounceEffect.spec', () => {
  it('test without wait', async () => {
    const fn = jest.fn();
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
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls[0]).toEqual([2, 1]);

    component.vm.inc();
    await wait();
    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls[1]).toEqual([3, 2]);

    component.vm.inc();
    await wait();
    expect(fn).toBeCalledTimes(3);
    expect(fn.mock.calls[2]).toEqual([4, 3]);
  });

  it('test wait', async () => {
    const fn = jest.fn();
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
    expect(fn).toBeCalledTimes(0);

    await wait(300);
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls[0]).toEqual([2, 1]);

    component.vm.wait = 400;
    component.vm.inc();
    await wait();
    await wait(300);
    expect(fn).toBeCalledTimes(1);

    await wait(100);
    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls[1]).toEqual([3, 2]);
  });

  it('test wait interrupt', async () => {
    const fn = jest.fn();
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
    expect(fn).toBeCalledTimes(0);

    await wait(300);
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls[0]).toEqual([2, 1]);

    component.vm.inc();
    await wait(150);
    component.vm.inc();
    await wait(150);
    expect(fn).toBeCalledTimes(1);

    await wait(300);
    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls[1]).toEqual([4, 3]);
  });

  it('should throw error when `useDebounceEffect` not be called inside of `setup()`', () => {
    expect(() => useDebounceEffect(() => {}, ref(1))).toThrowError(
      'Invalid hook call: `useDebounceEffect` can only be called inside of `setup()`.',
    );
  });
});
