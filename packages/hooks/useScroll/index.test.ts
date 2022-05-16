import { mount } from "@vue/test-utils";
import { ref, defineComponent } from "vue-demi";
import { useScroll } from ".";

describe("hooks/useScroll", () => {
  const getScrollComponent = (isDefault = true) =>
    mount(
      defineComponent({
        template: `<div ref="div" :style="isDefault ? {} : {}">
          <div style="width: 2000px; height: 3000px;"></div>
        </div>`,
        setup() {
          const div = ref();
          const { x, y } = useScroll(isDefault ? undefined : div);

          return {
            x,
            y,
            div,
            isDefault,
          };
        },
      })
    );

  it("test basic usage", async () => {
    let scrollTop = 0;
    let scrollLeft = 0;
    Object.defineProperty(window, "scrollTop", {
      configurable: true,
      set(val) {
        scrollTop = val;
      },
      get: function () {
        return scrollTop;
      },
    });
    Object.defineProperty(window, "scrollLeft", {
      configurable: true,
      set(val) {
        scrollLeft = val;
      },
      get: function () {
        return scrollLeft;
      },
    });

    // should add event listener to `document` by default
    const addEventListener = document.addEventListener.bind(document);
    const removeEventListener = document.removeEventListener.bind(document);
    const addFn = vi.fn();
    const removeFn = vi.fn();
    document.addEventListener = function (
      ...args: Parameters<Document["addEventListener"]>
    ) {
      addEventListener(...args);
      addFn();
    };
    document.removeEventListener = function (
      ...args: Parameters<Document["removeEventListener"]>
    ) {
      removeEventListener(...args);
      removeFn();
    };

    const component = getScrollComponent();
    expect(addFn).toHaveBeenCalledTimes(1);

    // should get reactive result
    expect(component.vm.x).toBe(0);
    expect(component.vm.y).toBe(0);

    // WIP
    // window.scrollLeft = 100;
    // window.scrollTop = 80;
    // expect(component.vm.x).toBe(100);
    // expect(component.vm.y).toBe(80);

    // should remove event listener when unmount
    component.unmount();
    expect(removeFn).toHaveBeenCalledTimes(1);
  });
});
