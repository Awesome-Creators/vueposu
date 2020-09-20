import { mount } from '@vue/test-utils';
import { ref } from 'vue-demi';
import useThrottleFn from '@hooks/useThrottleFn';
import { wait } from '@test/utils/helper';
import { defineComponent } from 'vue-demi';

describe('hooks/useThrottleFn', () => {
  it('test default case', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const count = ref(1);
          const fn = useThrottleFn(() => (count.value = count.value + 1));
          return {
            count,
            fn,
          };
        },
      }),
    );

    component.vm.fn();
    await wait();
    expect(component.vm.count).toBe(2);

    // multiple test
    component.vm.fn();
    await wait();

    component.vm.fn();
    await wait();

    component.vm.fn();
    await wait();

    expect(component.vm.count).toBe(5);

    // cancel test
    component.vm.fn();
    component.vm.fn();
    component.vm.fn();
    component.vm.fn.cancel();
    await wait();
    expect(component.vm.count).toBe(8);

    component.unmount();
  });

  it('test common case', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const count = ref(1);
          const fn = useThrottleFn(() => (count.value = count.value + 1), 300);
          return {
            count,
            fn,
          };
        },
      }),
    );

    component.vm.fn();
    await wait();
    expect(component.vm.count).toBe(2);

    await wait(210);
    expect(component.vm.count).toBe(2);

    await wait(310);
    expect(component.vm.count).toBe(2);

    // multiple test
    component.vm.fn();
    component.vm.fn();
    component.vm.fn();
    component.vm.fn();
    component.vm.fn();
    await wait();
    expect(component.vm.count).toBe(3);

    await wait(210);
    expect(component.vm.count).toBe(3);

    await wait(310);
    expect(component.vm.count).toBe(4);

    // cancel test
    component.vm.fn();

    await wait();
    expect(component.vm.count).toBe(5);

    await wait(210);
    expect(component.vm.count).toBe(5);

    await wait(310);
    expect(component.vm.count).toBe(5);

    component.unmount();
  });
});
