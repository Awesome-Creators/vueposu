import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useDebounce from '@hooks/useDebounce';
import { wait } from '@test/utils/helper';

describe('hooks/useDebounce', () => {
  it('test without wait', async () => {
    const component = mount(
      defineComponent({
        template: `
          <template>
            <span id="value">{{value}}</span>
            <span id="debounced">{{debounced}}</span>
          </template>
        `,
        setup() {
          1;
          const value = ref(1);
          const debounced = useDebounce(value);
          return {
            value,
            debounced,
          };
        },
      }),
    );

    component.vm.value = 2;
    await wait();

    expect(component.find('#value').text()).toBe('2');
    expect(component.find('#debounced').text()).toBe('2');
  });

  it('test wait', async () => {
    const component = mount(
      defineComponent({
        template: `
          <template>
            <span id="value">{{value}}</span>
            <span id="debounced">{{debounced}}</span>
          </template>
        `,
        setup() {
          const value = ref(1);
          const wait = ref(300);
          const debounced = useDebounce(value, wait);

          return {
            value,
            debounced,
            wait,
          };
        },
      }),
    );

    component.vm.value = 2;

    await component.vm.$nextTick();
    expect(component.find('#value').text()).toBe('2');
    expect(component.find('#debounced').text()).toBe('1');

    await wait(300);
    await component.vm.$nextTick();
    expect(component.find('#debounced').text()).toBe('2');

    component.vm.value = 3;
    expect(component.find('#debounced').text()).toBe('2');

    await wait(200);
    component.vm.value = 4;
    expect(component.find('#debounced').text()).toBe('2');

    await wait(200);
    expect(component.find('#value').text()).toBe('4');
    expect(component.find('#debounced').text()).toBe('2');

    await wait(300);
    expect(component.find('#value').text()).toBe('4');
    expect(component.find('#debounced').text()).toBe('4');

    component.vm.wait = 400;
    component.vm.value = 5;
    await wait(300);
    expect(component.find('#value').text()).toBe('5');
    expect(component.find('#debounced').text()).toBe('4');

    component.vm.value = 6;
    await wait(400);
    expect(component.find('#value').text()).toBe('6');
    expect(component.find('#debounced').text()).toBe('6');
  });

  it('should throw error when `useDebounce` not be called inside of `setup()`', () => {
    expect(() => useDebounce(ref(0))).toThrowError(
      'Invalid hook call: `useDebounce` can only be called inside of `setup()`.',
    );
  });
});
