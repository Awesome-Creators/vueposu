import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useThrottleEffect from '@hooks/useThrottleEffect';
import { wait } from '../../utils/helper';

describe('hooks/useThrottleEffect', () => {
  it('test without wait', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const count = ref(1);
          const inc = () => count.value++;
          useThrottleEffect(fn, count);
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
          useThrottleEffect(fn, count, wait);

          return {
            count,
            inc,
            wait
          };
        },
      }),
    );

    component.vm.inc();
    await wait();
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls[0]).toEqual([2, 1]);

    await wait(299);
    component.vm.inc();
    await wait();
    expect(fn).toBeCalledTimes(1);

    component.vm.wait = 400;
    component.vm.inc();
    await wait();
    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls[1]).toEqual([4, 3]);
    
    await wait(399);
    component.vm.inc();
    await wait();
    expect(fn).toBeCalledTimes(2);
  });

  it('test wait interrupt', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const count = ref(1);
          const inc = () => count.value++;
          useThrottleEffect(fn, count, 300);
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
    await wait(150);
    expect(fn).toBeCalledTimes(1);

    component.vm.inc();
    await wait(150);
    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls[1]).toEqual([3, 2]);
  });

  it('should throw error when `useThrottleEffect` not be called inside of `setup()`', () => {
    expect(() => useThrottleEffect(() => {}, ref(1))).toThrowError(
      'Invalid hook call: `useThrottleEffect` can only be called inside of `setup()`.',
    );
  });
});
