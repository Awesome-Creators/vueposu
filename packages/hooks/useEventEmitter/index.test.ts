import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue-demi";
import { useEventEmitter } from ".";
import { wait } from "@vueposu/test-utils";

describe("hooks/useEventEmitter", () => {
  it("should subscriptions all work when emit", async () => {
    const component = mount(
      defineComponent({
        template: "<template />",
        setup() {
          const count = ref(0);
          const text = ref("");
          const { emit, on } = useEventEmitter();

          on((value) => {
            text.value = value;
            count.value++;
          });

          return {
            count,
            text,
            emit,
            on,
          };
        },
      })
    );

    expect(component.vm.count).toBe(0);
    expect(component.vm.text).toBe("");

    component.vm.emit("a");
    await wait();
    expect(component.vm.count).toBe(1);
    expect(component.vm.text).toBe("a");

    component.vm.emit("b");
    await wait();
    expect(component.vm.count).toBe(2);
    expect(component.vm.text).toBe("b");

    component.vm.on((value) => {
      component.vm.text += value;
      component.vm.count++;
    });
    component.vm.emit("c");
    await wait();
    expect(component.vm.count).toBe(4);
    expect(component.vm.text).toBe("cc");

    component.vm.emit("d");
    await wait();
    expect(component.vm.count).toBe(6);
    expect(component.vm.text).toBe("dd");
  });

  it("should unsubscribe all emitters when unmounted", async () => {
    const spy = vi.fn();
    // const originalSetClear = Set.prototype.clear;
    // Set.prototype.clear = function () {
    //   console.log(spy)
    //   spy();
    //   originalSetClear.bind(this)();
    // };
    const component = mount(
      defineComponent({
        template: "<template />",
        setup() {
          const count = ref(0);
          const { emit, on } = useEventEmitter();

          on(() => {
            spy();
            count.value++;
          });

          return {
            count,
            emit,
            on,
          };
        },
      })
    );
    component.vm.emit();
    await wait();
    expect(component.vm.count).toBe(1);

    component.unmount();

    component.vm.emit();
    await wait();
    expect(component.vm.count).toBe(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
