import { defineComponent } from 'vue-demi';
import { useInterval } from ".";
import { mount } from '@vue/test-utils';
import { wait } from '@vueposu/test-utils';

describe('hooks/useInterval', () => {
  it('just callback', async () => {
    const fn = vi.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const { isActive } = useInterval(fn);
          return {
            isActive,
          };
        },
      }),
    );

    expect(component.vm.isActive).toBe(true);

    await wait(2100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(component.vm.isActive).toBe(true);

    component.unmount();
    expect(component.vm.isActive).toBe(false);

    await wait(1100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(component.vm.isActive).toBe(false);
  });

  it('custom time', async () => {
    const fn = vi.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const { isActive } = useInterval(fn, 300);
          return {
            isActive,
          };
        },
      }),
    );

    expect(component.vm.isActive).toBe(true);
    await wait(1000);
    expect(fn).toHaveBeenCalledTimes(3);
    component.unmount();
    expect(component.vm.isActive).toBe(false);

    await wait(1000);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(component.vm.isActive).toBe(false);
  });

  it('test immediateStart = false', async () => {
    const fn = vi.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const { isActive, start, stop } = useInterval(fn, 1000, false);
          return {
            isActive,
            start,
            stop,
          };
        },
      }),
    );

    expect(component.vm.isActive).toBe(false);
    await wait(1100);
    expect(fn).toHaveBeenCalledTimes(0);
    expect(component.vm.isActive).toBe(false);

    component.vm.start();
    expect(component.vm.isActive).toBe(true);
    await wait(2100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(component.vm.isActive).toBe(true);

    component.vm.stop();
    expect(component.vm.isActive).toBe(false);
    await wait(1100);
    expect(component.vm.isActive).toBe(false);
    expect(fn).toHaveBeenCalledTimes(2);

    component.unmount();
    expect(component.vm.isActive).toBe(false);

    await wait(1100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(component.vm.isActive).toBe(false);
  });
});
