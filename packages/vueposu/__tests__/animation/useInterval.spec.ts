import { defineComponent } from 'vue-demi';
import { useInterval } from 'vueposu';
import { mount } from '@vue/test-utils';
import { wait } from '@vueposu/test-utils';

jest.setTimeout(100000);

describe('animation/useInterval', () => {
  it('just callback', async () => {
    const fn = jest.fn();
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
    expect(fn).toBeCalledTimes(2);
    expect(component.vm.isActive).toBe(true);

    component.unmount();
    expect(component.vm.isActive).toBe(false);

    await wait(1100);
    expect(fn).toBeCalledTimes(2);
    expect(component.vm.isActive).toBe(false);
  });

  it('custom time', async () => {
    const fn = jest.fn();
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
    expect(fn).toBeCalledTimes(3);
    component.unmount();
    expect(component.vm.isActive).toBe(false);

    await wait(1000);
    expect(fn).toBeCalledTimes(3);
    expect(component.vm.isActive).toBe(false);
  });

  it('test immediateStart = false', async () => {
    const fn = jest.fn();
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
    expect(fn).toBeCalledTimes(0);
    expect(component.vm.isActive).toBe(false);

    component.vm.start();
    expect(component.vm.isActive).toBe(true);
    await wait(2100);
    expect(fn).toBeCalledTimes(2);
    expect(component.vm.isActive).toBe(true);

    component.vm.stop();
    expect(component.vm.isActive).toBe(false);
    await wait(1100);
    expect(component.vm.isActive).toBe(false);
    expect(fn).toBeCalledTimes(2);

    component.unmount();
    expect(component.vm.isActive).toBe(false);

    await wait(1100);
    expect(fn).toBeCalledTimes(2);
    expect(component.vm.isActive).toBe(false);
  });

  it('should throw error when `useInterval` not be called inside of `setup()`', () => {
    expect(() => useInterval(() => {})).toThrowError(
      'Invalid hook call: `useInterval` can only be called inside of `setup()`.',
    );
  });
});
