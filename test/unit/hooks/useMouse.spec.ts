import { defineComponent } from 'vue-demi';
import useMouse from '@hooks/useMouse';
import { mount } from '@vue/test-utils';

describe('hooks/useMouse', () => {
  it('test useMouse', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup: () => ({
          ...useMouse(),
        }),
      }),
    );

    const move = (x: number, y: number) => {
      document.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: x,
          clientY: y,
          screenX: x,
          screenY: y,
        }),
      );
    };

    expect(component.vm.pageX).toEqual(0);
    expect(component.vm.pageY).toEqual(0);
    expect(component.vm.screenX).toEqual(0);
    expect(component.vm.screenY).toEqual(0);
    expect(component.vm.clientX).toEqual(0);
    expect(component.vm.clientY).toEqual(0);

    move(100, 100);

    expect(component.vm.pageX).toEqual(undefined);
    expect(component.vm.pageY).toEqual(undefined);
    expect(component.vm.screenX).toEqual(100);
    expect(component.vm.screenY).toEqual(100);
    expect(component.vm.clientX).toEqual(100);
    expect(component.vm.clientY).toEqual(100);

    component.unmount();
  });

  it('check unmount', () => {
    const removeEventListener = document.removeEventListener.bind(document);
    const fn = jest.fn();
    document.removeEventListener = (...args) => {
      removeEventListener(...args);
      fn();
    };
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup: () => ({
          state: useMouse(),
        }),
      }),
    );

    component.unmount();
    expect(fn).toBeCalledTimes(1);
  });
});
