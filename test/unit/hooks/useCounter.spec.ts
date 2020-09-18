import { mount } from '@vue/test-utils';
import useCounter from '@hooks/useCounter';
import { defineComponent } from 'vue-demi';

describe('hooks/useCounter', () => {
  it('test useCounter', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [count, actions] = useCounter(0.2);

          return {
            count,
            ...actions,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0.2);

    component.vm.inc(0.1);
    expect(component.vm.count).toBe(0.3);

    component.vm.dec();
    expect(component.vm.count).toBe(-0.7);

    component.vm.set(8);
    expect(component.vm.count).toBe(8);

    component.vm.set(v => v + 2);
    expect(component.vm.count).toBe(10);

    component.vm.reset();
    expect(component.vm.count).toBe(0.2);

    component.unmount();
  });

  it('test useCounter min limit and max limit', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [count, actions] = useCounter(-10, {
            min: 0,
            max: 10,
          });

          return {
            count,
            ...actions,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0);

    component.vm.inc(2);
    expect(component.vm.count).toBe(2);

    component.vm.dec();
    expect(component.vm.count).toBe(1);

    component.vm.reset();
    expect(component.vm.count).toBe(0);

    component.vm.set(2);
    expect(component.vm.count).toBe(2);

    component.unmount();
  });

  it('test useCounter granularity', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [count, actions] = useCounter(0.2, {
            min: 0,
            granularity: 0.1,
          });

          return {
            count,
            ...actions,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0.2);

    component.vm.inc();
    expect(component.vm.count).toBe(0.3);

    component.vm.set(v => v + 0.1);
    expect(component.vm.count).toBe(0.4);

    component.vm.dec();
    expect(component.vm.count).toBe(0.3);

    component.vm.dec(99);
    expect(component.vm.count).toBe(0);

    component.vm.reset();
    expect(component.vm.count).toBe(0.2);

    component.unmount();
  });

  it('mock js user', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [count, actions] = useCounter('屁股我们能' as any, {
            granularity: '男孩下个门' as any,
          });

          return {
            count,
            ...actions,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0);

    component.vm.inc(0.1);
    expect(component.vm.count).toBe(0.1);

    component.vm.dec();
    expect(component.vm.count).toBe(-0.9);

    component.vm.set(8);
    expect(component.vm.count).toBe(8);

    component.vm.set(v => v + 2);
    expect(component.vm.count).toBe(10);

    component.vm.reset();
    expect(component.vm.count).toBe(0);
    component.unmount();
  });
});
