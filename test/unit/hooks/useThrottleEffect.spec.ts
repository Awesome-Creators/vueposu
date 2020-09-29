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
          const val = ref(1);
          const changeVal = () => {
            val.value += 1;
          };
          useThrottleEffect(fn, val);
          return {
            val,
            changeVal,
          };
        },
      }),
    );

    component.vm.changeVal();
    await wait();
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls).toContainEqual([2, 1]);

    component.vm.changeVal();
    await wait();
    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls).toContainEqual([3, 2]);
  });

  it('test wait', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const val = ref(1);
          const changeVal = () => {
            val.value += 1;
          };
          useThrottleEffect(fn, val, 300);
          return {
            val,
            changeVal,
          };
        },
      }),
    );

    component.vm.changeVal();
    await wait();
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls).toContainEqual([2, 1]);

    await wait(300);
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls).toContainEqual([2, 1]);

    await wait(300);
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls).toContainEqual([2, 1]);
  });

  it('test wait interrupt', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const val = ref(1);
          const changeVal = () => {
            val.value += 1;
          };
          useThrottleEffect(fn, val, 300);
          return {
            val,
            changeVal,
          };
        },
      }),
    );

    component.vm.changeVal();
    await wait();
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls).toContainEqual([2, 1]);

    component.vm.changeVal();
    await wait(150);
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls).toContainEqual([2, 1]);

    component.vm.changeVal();
    await wait(150);
    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls).toContainEqual([3, 2]);
  });
});
