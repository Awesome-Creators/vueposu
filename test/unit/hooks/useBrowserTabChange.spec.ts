import { mount } from '@vue/test-utils';
import { ref, defineComponent } from 'vue-demi';
import useBrowserTabChange from '@hooks/useBrowserTabChange';
import { triggerDomEvent, wait } from '@test/utils/helper';

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

  it('test basic usage', async () => {
    // test unmount
    const removeEventListener = document.removeEventListener.bind(document);
    const fn = jest.fn();
    document.removeEventListener = (...args) => {
      removeEventListener(...args);
      fn();
    };

    const component = mount(
      defineComponent({
        setup() {
          const leave = ref(false);
          useBrowserTabChange(isHidden => {
            leave.value = isHidden;
          });
          return { leave };
        },
        template: `<template />`,
      }),
    );

    expect(component.vm.leave).toBe(false);

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    // wait dom change
    await wait();
    expect(component.vm.leave).toBe(true);

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    // wait dom change
    await wait();
    expect(component.vm.leave).toBe(false);

    component.unmount();
    expect(fn).toBeCalledTimes(4);
  });
});
