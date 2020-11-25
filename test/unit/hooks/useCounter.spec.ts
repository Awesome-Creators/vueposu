import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useCounter from '@hooks/useCounter';

describe('hooks/useCounter', () => {
  it('should be work when it is without options', () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const { count, ...actions } = useCounter('0');

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

  it('should be work when directly modify count', async () => {
    const component = mount(
      defineComponent({
        template: `
          <template>
            <span id="inc" @click="count++" />
            <span id="dec" @click="count--" />
            <span id="count">{{ count }}</span>
          </template>
        `,
        setup() {
          const { count } = useCounter(0, {
            min: -1,
            max: 2,
          });

          return {
            count,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0);
    expect(component.find('#count').text()).toBe('0');

    const testInc = async val => {
      await component.find('#inc').trigger('click');
      expect(component.vm.count).toBe(val);
      expect(component.find('#count').text()).toBe(String(val));
    };

    const testDec = async val => {
      await component.find('#dec').trigger('click');
      expect(component.vm.count).toBe(val);
      expect(component.find('#count').text()).toBe(String(val));
    };

    await testInc(1);
    await testInc(2);
    await testInc(2);

    await testDec(1);
    await testDec(0);
    await testDec(-1);
    await testDec(-1);

    expect(() => (component.vm.count = 'boy next door' as any)).toThrowError(
      'Invalid assignment: expected a number-string or number but got: string',
    );
    expect(() => (component.vm.count = null as any)).toThrowError(
      new TypeError(
        'Invalid assignment: expected a number-string or number but got: null',
      ),
    );
  });

  it('should be work when it is set options', () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const { count, ...actions } = useCounter(0, {
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

  it('should be work when `initialValue`, `min`, `max`, `step` is RefTyped', () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const initial = ref(0.2);
          const min = ref(0);
          const max = ref(10);
          const step = ref(0.1);
          const { count, ...actions } = useCounter(initial, {
            min,
            max,
            step,
          });

          return {
            initial,
            min,
            max,
            step,
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
    component.vm.step = 2;
    component.vm.inc();
    expect(component.vm.count).toBe(4);

    component.vm.dec(4);
    expect(component.vm.count).toBe(3);

    component.vm.min = 0;
    component.vm.reset();
    expect(component.vm.count).toBe(2);
    
    component.vm.min = 3;
    expect(component.vm.count).toBe(3);
    
    component.vm.min = 0;
    component.vm.max = 2;
    expect(component.vm.count).toBe(2);

    // Mock for js users.
    component.vm.initial = 'boy next door' as any;
    component.vm.reset();
    expect(component.vm.count).toBe(0);

    component.vm.step = 'thank you sir' as any;
    component.vm.inc();
    expect(component.vm.count).toBe(1);

    component.unmount();
  });

  it('should throw error when `useCounter` not be called inside of `setup()`', () => {
    expect(() => useCounter()).toThrowError(
      'Invalid hook call: `useCounter` can only be called inside of `setup()`.',
    );
  });
});
