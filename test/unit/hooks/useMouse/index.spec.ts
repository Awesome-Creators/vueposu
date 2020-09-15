import { defineComponent } from 'vue';
import useMouse from '@hooks/useMouse';
import { mount } from '@vue/test-utils';

describe('hooks/useMouse', () => {
  it('test useMouse', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup: () => ({
          state: useMouse(),
        }),
      }),
    );

    expect(component.vm.state).toEqual({
      pageX: 0,
      pageY: 0,
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
    });

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

    move(100, 100);

    expect(component.vm.state).toEqual({
      pageX: undefined,
      pageY: undefined,
      screenX: 100,
      screenY: 100,
      clientX: 100,
      clientY: 100,
    });

    component.unmount();
  });
});
