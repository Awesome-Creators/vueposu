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
          const val = ref('1');
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
    expect(fn.mock.calls).toContainEqual(['11', '1']);

    component.vm.changeVal();
    await wait();
    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls).toContainEqual(['111', '11']);

    component.vm.changeVal();
    await wait();
    expect(fn).toBeCalledTimes(3);
    expect(fn.mock.calls).toContainEqual(['1111', '111']);
  });

  it('test wait', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const val = ref('1');
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

    component.vm.changeVal(); // 11, 1
    await wait();
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls).toContainEqual(['11', '1']);

    component.vm.changeVal(); // 111, 11
    await wait();
    component.vm.changeVal(); // 1111, 111
    await wait();
    component.vm.changeVal(); // 11111, 1111

    await wait(320);

    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls).toContainEqual(['11111', '1111']);
  });

  it('test wait interrupt', async () => {
    const fn = jest.fn();
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const val = ref('1');
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

    component.vm.changeVal(); // 11, 1
    await wait();
    expect(fn).toBeCalledTimes(1);
    expect(fn.mock.calls).toContainEqual(['11', '1']);

    component.vm.changeVal(); // 111, 11
    await wait(120);
    component.vm.changeVal(); // 1111, 111
    await wait(280);
    component.vm.changeVal(); // 11111, 1111

    expect(fn).toBeCalledTimes(2);
    expect(fn.mock.calls).toContainEqual(['1111', '111']);

    await wait(320);
    expect(fn).toBeCalledTimes(3);
    expect(fn.mock.calls).toContainEqual(['11111', '1111']);
  });
});