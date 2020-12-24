import { mount } from '@vue/test-utils';
import { useToggle } from 'vueposu';
import { defineComponent, ref } from 'vue-demi';

describe('state/useToggle', () => {
  it('should be work when `defaultValue` is undef', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const { state, setLeft, setRight, toggle } = useToggle();

          return {
            state,
            setLeft,
            setRight,
            toggle,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.state).toBe(true);

    component.vm.toggle();
    expect(component.vm.state).toBe(false);

    component.vm.setLeft();
    expect(component.vm.state).toBe(true);

    component.vm.toggle('boy next door');
    expect(component.vm.state).toBe('boy next door');

    component.vm.setRight();
    expect(component.vm.state).toBe(false);

    component.vm.toggle();
    expect(component.vm.state).toBe(true);

    component.vm.state = 'boy next door';
    expect(component.vm.state).toBe('boy next door');
  });

  it('should be work when `reverseValue` is undef', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const { state, setLeft, setRight, toggle } = useToggle('hello');

          return {
            state,
            setLeft,
            setRight,
            toggle,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.state).toBe('hello');

    component.vm.toggle();
    expect(component.vm.state).toBe(false);

    component.vm.setLeft();
    expect(component.vm.state).toBe('hello');

    component.vm.toggle('boy next door');
    expect(component.vm.state).toBe('boy next door');

    component.vm.setRight();
    expect(component.vm.state).toBe(false);

    component.vm.toggle();
    expect(component.vm.state).toBe('hello');
  });

  it('should be work when `defaultValue`, `reverseValue` is RefTyped', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const defaultValue = ref('hello');
          const reverseValue = ref('world');
          const { state, setLeft, setRight, toggle } = useToggle(
            defaultValue,
            reverseValue,
          );

          return {
            defaultValue,
            reverseValue,
            state,
            setLeft,
            setRight,
            toggle,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.state).toBe('hello');

    component.vm.toggle();
    expect(component.vm.state).toBe('world');

    component.vm.toggle('boy next door');
    expect(component.vm.state).toBe('boy next door');

    component.vm.toggle();
    expect(component.vm.state).toBe('hello');

    component.vm.defaultValue = 'boy next door';
    component.vm.setLeft();
    expect(component.vm.state).toBe('boy next door');

    component.vm.toggle();
    expect(component.vm.state).toBe('world');

    component.vm.reverseValue = 'thank you sir';
    component.vm.setRight();
    expect(component.vm.state).toBe('thank you sir');

    component.vm.toggle();
    expect(component.vm.state).toBe('boy next door');
  });
});
