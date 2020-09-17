import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { wait } from '@test/utils/helper';
import useDebounce from '@hooks/useDebounce';

describe('hooks/useDebounce', () => {
  it('test default case', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(1);
          const fn = useDebounce(() => (count.value = count.value + 1));
          return {
            count,
            fn,
          };
        },
        template: `<template />`,
      }),
    );

    component.vm.fn();
    await wait();
    expect(component.vm.count).toBe(2);

    // multiple test
    component.vm.fn();
    await wait();

    component.vm.fn();
    await wait();

    component.vm.fn();
    await wait();

    expect(component.vm.count).toBe(5);

    // cancel test
    component.vm.fn();
    component.vm.fn();
    component.vm.fn();
    component.vm.fn.cancel();
    await wait();

    expect(component.vm.count).toBe(5);

    component.unmount();
  });

  it('test common case', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(1);
          const fn = useDebounce(() => (count.value = count.value + 1), 300);
          return {
            count,
            fn,
          };
        },
        template: `<template />`,
      }),
    );
    component.vm.fn();
    await wait();
    expect(component.vm.count).toBe(1);
    await wait(210);
    expect(component.vm.count).toBe(1);
    await wait(310);
    expect(component.vm.count).toBe(2);

    // multiple test
    component.vm.fn();
    await wait();
    expect(component.vm.count).toBe(2);

    await wait(210);
    expect(component.vm.count).toBe(2);

    await wait(310);
    expect(component.vm.count).toBe(3);

    // cancel test
    component.vm.fn();
    component.vm.fn.cancel();

    await wait();
    expect(component.vm.count).toBe(3);

    await wait(210);
    expect(component.vm.count).toBe(3);

    await wait(310);
    expect(component.vm.count).toBe(3);

    component.unmount();
  });
});
