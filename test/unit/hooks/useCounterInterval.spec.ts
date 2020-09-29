import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useCounterInterval from '@hooks/useCounterInterval';
import { wait } from '../../utils/helper';

describe('hooks/useCounterInterval', () => {
  it('without params', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const [counter, active, start, stop] = useCounterInterval();
          return {
            counter,
            active,
            start,
            stop,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.counter).toBe(60);
    expect(component.vm.active).toBe(false);
    component.vm.start();

    await wait(15000);
    expect(component.vm.counter).toBe(45);
    expect(component.vm.active).toBe(true);

    await wait(30000);
    expect(component.vm.counter).toBe(15);
    expect(component.vm.active).toBe(true);

    await wait(14000);
    expect(component.vm.counter).toBe(1);

    component.vm.stop();
    await wait(10000);
    expect(component.vm.counter).toBe(1);
    expect(component.vm.active).toBe(false);

    component.vm.start();
    await wait(1000);
    expect(component.vm.counter).toBe(0);
    expect(component.vm.active).toBe(false);

    await wait();
    expect(component.vm.active).toBe(false);
  });

  it('immediateStart = true', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const [counter, active, start, stop] = useCounterInterval({
            immediateStart: true,
          });
          return {
            counter,
            active,
            start,
            stop,
          };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.counter).toBe(60);
    expect(component.vm.active).toBe(true);

    await wait(15000);
    expect(component.vm.counter).toBe(45);
    expect(component.vm.active).toBe(true);

    await wait(30000);
    expect(component.vm.counter).toBe(15);
    expect(component.vm.active).toBe(true);

    await wait(15000);
    expect(component.vm.counter).toBe(0);
    await wait();
    expect(component.vm.active).toBe(false);
  });

  it('test inc', () => {});

  it('test dec', () => {});
});
