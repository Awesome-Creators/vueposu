import { mount } from '@vue/test-utils';
import useToggle from '@hooks/useToggle';
import { defineComponent, ref } from 'vue-demi';

describe('hooks/useToggle', () => {
  it('should be work when `defaultValue` is undef', async () => {
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

    component.vm.setLeft();
    expect(component.vm.status).toBe(true);

    component.vm.toggle('boy next door');
    expect(component.vm.status).toBe('boy next door');

    component.vm.setRight();
    expect(component.vm.status).toBe(false);

    component.vm.toggle();
    expect(component.vm.status).toBe(true);
  });

  it('should be work when `reverseValue` is undef', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const [status, toggles] = useToggle('hello');

          return {
            status,
            ...toggles,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.status).toBe('hello');

    component.vm.toggle();
    expect(component.vm.status).toBe(false);

    component.vm.setLeft();
    expect(component.vm.status).toBe('hello');

    component.vm.toggle('boy next door');
    expect(component.vm.status).toBe('boy next door');

    component.vm.setRight();
    expect(component.vm.status).toBe(false);

    component.vm.toggle();
    expect(component.vm.status).toBe('hello');
  });

  it('should be work when `defaultValue`, `reverseValue` is RefTyped', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const defaultValue = ref('hello');
          const reverseValue = ref('world');
          const [status, toggles] = useToggle(defaultValue, reverseValue);

          return {
            defaultValue,
            reverseValue,
            status,
            ...toggles,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.status).toBe('hello');

    component.vm.toggle();
    expect(component.vm.status).toBe('world');

    component.vm.toggle('boy next door');
    expect(component.vm.status).toBe('boy next door');

    component.vm.toggle();
    expect(component.vm.status).toBe('hello');

    component.vm.defaultValue = 'boy next door';
    component.vm.setLeft();
    expect(component.vm.status).toBe('boy next door');

    component.vm.toggle();
    expect(component.vm.status).toBe('world');

    component.vm.reverseValue = 'thank you sir';
    component.vm.setRight();
    expect(component.vm.status).toBe('thank you sir');

    component.vm.toggle();
    expect(component.vm.status).toBe('boy next door');
  });
});
