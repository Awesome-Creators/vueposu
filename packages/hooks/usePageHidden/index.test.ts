import { mount } from "@vue/test-utils";
import { ref, defineComponent } from "vue-demi";
import { usePageHidden } from ".";
import { triggerDomEvent, wait } from "@vueposu/test-utils";

describe("hooks/usePageHidden", () => {
  beforeEach(() => {
    let val = true;
    Object.defineProperty(document, "hidden", {
      configurable: true,
      set($val) {
        val = $val;
      },
      get: function () {
        return val;
      },
    });
  });

  it("test basic usage", async () => {
    // test unmount
    const removeEventListener = document.removeEventListener.bind(document);
    const fn = vi.fn();
    document.removeEventListener = function (
      ...args: Parameters<Document["removeEventListener"]>
    ) {
      removeEventListener(...args);
      fn();
    };

    const component = mount(
      defineComponent({
        setup() {
          const leave = ref(false);
          usePageHidden((isHidden) => {
            leave.value = !!isHidden;
          });
          return { leave };
        },
        template: `<template />`,
      })
    );

    expect(component.vm.leave).toBe(false);

    // leave
    triggerDomEvent("visibilitychange");
    (document as any).hidden = true;

    // wait dom change
    await wait();
    expect(component.vm.leave).toBe(true);

    // back
    triggerDomEvent("visibilitychange");
    (document as any).hidden = false;

    // wait dom change
    await wait();
    expect(component.vm.leave).toBe(false);

    component.unmount();
    expect(fn).toHaveBeenCalledTimes(4);
  });
});
