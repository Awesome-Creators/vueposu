import { mount } from '@vue/test-utils';
import { useThrottleFn } from ".";
import { wait } from '@vueposu/test-utils';
import { defineComponent } from 'vue-demi';

describe('hooks/useThrottleFn', () => {
  it('test default case', async () => {
    const spy = vi.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const fn = useThrottleFn(spy);
          return {
            fn,
          };
        },
      }),
    );

    component.vm.fn();
    await wait();
    expect(spy).toHaveBeenCalledTimes(1);

    component.vm.fn();
    component.vm.fn.cancel();
    await wait();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('test common case', async () => {
    const spy = vi.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const fn = useThrottleFn(spy, 300);
          return {
            fn,
          };
        },
      }),
    );

    component.vm.fn();
    await wait();
    expect(spy).toHaveBeenCalledTimes(1);

    component.vm.fn();
    component.vm.fn.cancel();
    await wait();
    expect(spy).toHaveBeenCalledTimes(1);

    await wait(300);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('test wait interrupt', async () => {
    const spy = vi.fn();
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const fn = useThrottleFn(spy, 300);
          return {
            fn,
          };
        },
      }),
    );

    component.vm.fn();
    await wait();
    expect(spy).toHaveBeenCalledTimes(1);

    component.vm.fn();
    await wait(150);
    component.vm.fn();
    await wait(150);

    expect(spy).toHaveBeenCalledTimes(2);

    component.vm.fn();
    await wait(150);
    expect(spy).toHaveBeenCalledTimes(2);

    component.vm.fn();
    await wait(150);
    expect(spy).toHaveBeenCalledTimes(3);

    component.vm.fn();
    await wait(280);

    component.vm.fn();
    await wait(320);
    await wait();

    expect(spy).toHaveBeenCalledTimes(4);
  });
});
