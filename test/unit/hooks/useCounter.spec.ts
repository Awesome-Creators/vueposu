import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useCounter from '@hooks/useCounter';

describe('hooks/useCounter', () => {
  it('should be work when it is without options', () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [count, actions] = useCounter('0');

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

    component.vm.set(v => v + 99);
    expect(component.vm.count).toBe(100);

    component.vm.set(0.2);
    expect(component.vm.count).toBe(0.2);

    component.vm.inc(0.1);
    expect(component.vm.count).toBe(0.3);

    component.vm.reset();
    expect(component.vm.count).toBe(0);
  });

  
  it('should be work when it is set options', () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const [count, actions] = useCounter(0, {
            min: 2,
            max: '10',
          });

          return {
            count,
            ...actions,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(2);

    component.vm.inc(2);
    expect(component.vm.count).toBe(4);

    component.vm.dec();
    expect(component.vm.count).toBe(3);

    component.vm.set(99);
    expect(component.vm.count).toBe(10);

    component.vm.set(v => v - 0.2);
    expect(component.vm.count).toBe(9.8);

    component.vm.reset();
    expect(component.vm.count).toBe(2);
  });

  it('should be work when `initialValue`, `min`, `max`, `x` is RefTyped', () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const initial = ref(0.2);
          const min = ref(0);
          const max = ref(10);
          const x = ref(0.1);
          const [count, actions] = useCounter(initial, {
            min,
            max,
            x,
          });

          return {
            initial,
            min,
            max,
            x,
            count,
            ...actions,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0.2);

    component.vm.inc();
    expect(component.vm.count).toBe(0.3);

    component.vm.dec(0.2);
    expect(component.vm.count).toBe(0.1);

    component.vm.set(8);
    expect(component.vm.count).toBe(8);

    component.vm.set(v => v + 3);
    expect(component.vm.count).toBe(10);

    component.vm.reset();
    expect(component.vm.count).toBe(0.2);

    component.vm.initial = 2;
    component.vm.reset();
    expect(component.vm.count).toBe(2);

    component.vm.min = 3;
    component.vm.reset();
    expect(component.vm.count).toBe(3);

    component.vm.max = 4;
    component.vm.x = 2;
    component.vm.inc();
    expect(component.vm.count).toBe(4);

    component.vm.dec(4);
    expect(component.vm.count).toBe(3);

    component.vm.min = 0;
    component.vm.reset();
    expect(component.vm.count).toBe(2);

    // Mock for js users.
    component.vm.initial = 'boy next door' as any;
    component.vm.reset();
    expect(component.vm.count).toBe(0);

    component.vm.x = 'thank you sir' as any;
    component.vm.inc();
    expect(component.vm.count).toBe(1);

    component.unmount();
  });
});
