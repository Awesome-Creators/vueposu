import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useDebounceFn from '../src/useDebounceFn';
import { wait } from '@/utils/helper';

describe('hooks/useDebounceFn', () => {
  it('test default case', async () => {
    const spy = jest.fn();
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
    expect(spy).toBeCalledTimes(1);

    component.vm.fn();
    component.vm.fn.cancel();
    await wait();
    expect(spy).toBeCalledTimes(1);
  });

  it('test common case', async () => {
    const spy = jest.fn();
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
    expect(spy).toBeCalledTimes(0);

    await wait(300);
    expect(spy).toBeCalledTimes(1);

    component.vm.fn();
    await wait(100);
    component.vm.fn();
    await wait(100);
    component.vm.fn();
    await wait(100);
    expect(spy).toBeCalledTimes(1);

    await wait(200);
    expect(spy).toBeCalledTimes(2);

    component.vm.fn();
    await wait(298);
    component.vm.fn.cancel();
    await wait(2);
    expect(spy).toBeCalledTimes(2);
  });

  it('should throw error when `useDebounceFn` not be called inside of `setup()`', () => {
    expect(() => useDebounceFn(() => null)).toThrowError(
      'Invalid hook call: `useDebounceFn` can only be called inside of `setup()`.',
    );
  });
});
