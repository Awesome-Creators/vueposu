import { mount } from '@vue/test-utils';
import useToggle from '@hooks/useToggle';
import { defineComponent } from 'vue';

describe('hooks/useToggle', () => {
  it('simple toggle test', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const [status, toggles] = useToggle();

          return {
            status,
            ...toggles,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.status).toBe(true);

    component.vm.toggle();
    expect(component.vm.status).toBe(false);

    component.vm.toggle('boy next door');
    expect(component.vm.status).toBe('boy next door');

    component.vm.toggle();
    expect(component.vm.status).toBe(true);

    component.vm.setRight();
    expect(component.vm.status).toBe(false);

    component.vm.setLeft();
    expect(component.vm.status).toBe(true);

    component.unmount();
  });

  it('defaultValue toggle test', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const [status, toggles] = useToggle('open', 'close');

          return {
            status,
            ...toggles,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.status).toBe('open');

    component.vm.toggle();
    expect(component.vm.status).toBe('close');

    component.vm.toggle('boy next door');
    expect(component.vm.status).toBe('boy next door');

    component.vm.toggle();
    expect(component.vm.status).toBe('open');

    component.vm.setRight();
    expect(component.vm.status).toBe('close');

    component.vm.setLeft();
    expect(component.vm.status).toBe('open');

    component.unmount();
  });
});
