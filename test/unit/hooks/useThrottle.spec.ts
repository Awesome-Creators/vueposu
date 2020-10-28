import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useThrottle from '@hooks/useThrottle';
import { wait } from '@test/utils/helper';

describe('hooks/useThrottle', () => {
  it('test without wait', async () => {
    const component = mount(
      defineComponent({
        template: `
          <template>
            <span id="value">{{value}}</span>
            <span id="throttled">{{throttled}}</span>
          </template>
        `,
        setup() {
          const value = ref(1);
          const throttled = useThrottle(value);

          return {
            value,
            throttled,
          };
        },
      }),
    );

    component.vm.value = 2;
    await wait();

    expect(component.find('#value').text()).toBe('2');
    expect(component.find('#throttled').text()).toBe('2');
  });

  it('test wait', async () => {
    const component = mount(
      defineComponent({
        template: `
          <template>
            <span id="value">{{value}}</span>
            <span id="throttled">{{throttled}}</span>
          </template>
        `,
        setup() {
          const value = ref(1);
          const wait = ref(100);
          const throttled = useThrottle(value, wait);

          return {
            value,
            throttled,
            wait
          };
        },
      }),
    );

    component.vm.value = 2;

    await component.vm.$nextTick();
    expect(component.find('#value').text()).toBe('2');
    expect(component.find('#throttled').text()).toBe('2');

    component.vm.value = 3;
    await component.vm.$nextTick();
    expect(component.find('#value').text()).toBe('3');
    expect(component.find('#throttled').text()).toBe('2');

    component.vm.value = 4;
    await component.vm.$nextTick();
    expect(component.find('#value').text()).toBe('4');
    expect(component.find('#throttled').text()).toBe('2');

    await wait(100);
    expect(component.find('#throttled').text()).toBe('4');

    component.vm.wait = 200;
    component.vm.value = 5;
    await component.vm.$nextTick();
    expect(component.find('#value').text()).toBe('5');
    expect(component.find('#throttled').text()).toBe('5');

    component.vm.value = 6;
    await component.vm.$nextTick();
    expect(component.find('#value').text()).toBe('6');
    expect(component.find('#throttled').text()).toBe('5');

    component.vm.value = 7;
    await component.vm.$nextTick();
    expect(component.find('#value').text()).toBe('7');
    expect(component.find('#throttled').text()).toBe('5');

    await wait(200);
    expect(component.find('#throttled').text()).toBe('7');
  });
});
