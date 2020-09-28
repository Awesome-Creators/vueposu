import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useDebounceEffect from '@hooks/useDebounceEffect';
import { wait } from '../../utils/helper';

describe('hooks/useDebounceEffect.spec', () => {
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
          useDebounceEffect(fn, val);
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
          useDebounceEffect(fn, val, 300);
          return {
            val,
            changeVal,
          };
        },
      }),
    );

    // TODO: ...
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
          useDebounceEffect(fn, val, 300);
          return {
            val,
            changeVal,
          };
        },
      }),
    );

    // TODO: ...
  });
});
