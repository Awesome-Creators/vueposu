import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useEventEmitter from '@hooks/useEventEmitter';

describe('hooks/useEventEmitter', () => {
  it('should subscriptions all work when emit', () => {
    const component = mount(
      defineComponent({
        template: '<div></div>',
        setup() {
          const count = ref(0);
          const text = ref('');
          const { emit, useSubscription } = useEventEmitter();

          useSubscription(value => {
            text.value = value;
            count.value++;
          });

          return {
            count,
            text,
            emit,
            useSubscription,
          };
        },
      }),
    );

    expect(component.vm.count).toBe(0);
    expect(component.vm.text).toBe('');

    component.vm.emit('a');
    expect(component.vm.count).toBe(1);
    expect(component.vm.text).toBe('a');

    component.vm.emit('b');
    expect(component.vm.count).toBe(2);
    expect(component.vm.text).toBe('b');

    component.vm.useSubscription(value => {
      component.vm.text += value;
      component.vm.count++;
    });
    component.vm.emit('c');
    expect(component.vm.count).toBe(4);
    expect(component.vm.text).toBe('cc');

    component.vm.emit('d');
    expect(component.vm.count).toBe(6);
    expect(component.vm.text).toBe('dd');
  });

  it('should throw error when `useEventEmitter` not be called inside of `setup()`', () => {
    expect(() => useEventEmitter()).toThrowError(
      'Invalid hook call: `useEventEmitter` can only be called inside of `setup()`.',
    );
  });
});
