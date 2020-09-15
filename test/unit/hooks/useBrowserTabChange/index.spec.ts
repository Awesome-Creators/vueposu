import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import useBrowserTabChange from '@hooks/useBrowserTabChange';
import { triggerDomEvent, wait } from '@test/utils/helper';
import { defineComponent } from 'vue';

describe('hooks/useBrowserTabChange', () => {
  beforeEach(() => {
    let val = true;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      set($val) {
        val = $val;
      },
      get: function () {
        return val;
      },
    });
  });

  it('test options', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const $leave = ref(false);
          const $back = ref(true);
          const [$leaveRef, $backRef] = useBrowserTabChange({
            leave: () => {
              $leave.value = true;
              $back.value = false;
            },
            back: () => {
              $leave.value = false;
              $back.value = true;
            },
          });
          return { $leave, $back, $leaveRef, $backRef };
        },
        template: `<template />`,
      }),
    );
    expect(component.vm.$leave).toBe(false);
    expect(component.vm.$back).toBe(true);
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    // wait dom change
    await wait();
    expect(component.vm.$leave).toBe(true);
    expect(component.vm.$back).toBe(false);
    expect(component.vm.$leaveRef).toBe(true);
    expect(component.vm.$backRef).toBe(false);

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    // wait dom change
    await wait();
    expect(component.vm.$leave).toBe(false);
    expect(component.vm.$back).toBe(true);
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    component.unmount();
  });

  it('test common', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const $leave = ref(false);
          const $back = ref(true);
          const [$leaveRef, $backRef] = useBrowserTabChange(
            ({ leave, back }) => {
              $leave.value = leave;
              $back.value = back;
            },
          );
          return { $leave, $back, $leaveRef, $backRef };
        },
      }),
    );
    expect(component.vm.$leave).toBe(false);
    expect(component.vm.$back).toBe(true);
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    // wait dom change
    await wait();
    expect(component.vm.$leave).toBe(true);
    expect(component.vm.$back).toBe(false);
    expect(component.vm.$leaveRef).toBe(true);
    expect(component.vm.$backRef).toBe(false);

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    // wait dom change
    await wait();
    expect(component.vm.$leave).toBe(false);
    expect(component.vm.$back).toBe(true);
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    component.unmount();
  });

  it('test not options', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const $leave = ref(false);
          const $back = ref(true);
          const [$leaveRef, $backRef] = useBrowserTabChange();
          return { $leave, $back, $leaveRef, $backRef };
        },
      }),
    );
    expect(component.vm.$leave).toBe(false);
    expect(component.vm.$back).toBe(true);
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    component.unmount();
  });

  it('test single options', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const count = ref(0);
          const [$leaveRef, $backRef] = useBrowserTabChange({
            leave: () => {
              count.value += 1;
            },
          });
          return { count, $leaveRef, $backRef };
        },
      }),
    );
    expect(component.vm.count).toBe(0);
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    await wait();
    expect(component.vm.count).toBe(1);
    expect(component.vm.$leaveRef).toBe(true);
    expect(component.vm.$backRef).toBe(false);

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    await wait();
    expect(component.vm.count).toBe(1);
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    await wait();
    expect(component.vm.count).toBe(2);
    expect(component.vm.$leaveRef).toBe(true);
    expect(component.vm.$backRef).toBe(false);

    component.unmount();
  });

  it('mock js user', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup() {
          const [$leaveRef, $backRef] = useBrowserTabChange(
            '屁股我们能' as any,
          );
          return { $leaveRef, $backRef };
        },
      }),
    );
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    await wait();
    expect(component.vm.$leaveRef).toBe(true);
    expect(component.vm.$backRef).toBe(false);

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    await wait();
    expect(component.vm.$leaveRef).toBe(false);
    expect(component.vm.$backRef).toBe(true);

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    await wait();
    expect(component.vm.$leaveRef).toBe(true);
    expect(component.vm.$backRef).toBe(false);
    component.unmount();
  });

  it('test unmount', async () => {
    const removeEventListener = document.removeEventListener.bind(document);
    const fn = jest.fn();
    document.removeEventListener = (...args) => {
      removeEventListener(...args);
      fn();
    };

    const component = mount(
      defineComponent({
        setup() {
          const $leave = ref(false);
          const $back = ref(true);
          const [$leaveRef, $backRef] = useBrowserTabChange({
            leave: () => {
              $leave.value = true;
              $back.value = false;
            },
            back: () => {
              $leave.value = false;
              $back.value = true;
            },
          });
          return { $leave, $back, $leaveRef, $backRef };
        },
        template: `<template />`,
      }),
    );
    component.unmount();

    expect(fn).toBeCalledTimes(4);
  });
});
