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

  it('test step = 2', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const [counter, active, start, stop] = useCounterInterval({
            step: 2,
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
    expect(component.vm.active).toBe(false);
    component.vm.start();

    await wait(15000);
    expect(component.vm.counter).toBe(30);
    expect(component.vm.active).toBe(true);

    await wait(30000);
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

  it('test inc', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const [counter, active, start, stop] = useCounterInterval({
            immediateStart: true,
            type: 'inc',
            initialValue: 0,
            total: 60,
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

    expect(component.vm.counter).toBe(0);
    expect(component.vm.active).toBe(true);

    await wait(15000);
    expect(component.vm.counter).toBe(15);
    expect(component.vm.active).toBe(true);

    await wait(30000);
    expect(component.vm.counter).toBe(45);
    expect(component.vm.active).toBe(true);

    await wait(15000);
    expect(component.vm.counter).toBe(60);
    await wait();
    expect(component.vm.active).toBe(false);
  });

  it('test dec', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const [counter, active, start, stop] = useCounterInterval({
            type: 'dec',
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
});
