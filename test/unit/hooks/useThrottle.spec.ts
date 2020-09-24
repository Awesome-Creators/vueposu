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
            <span id="val">{{val}}</span>
            <span id="val2">{{val2}}</span>
          </template>
        `,
        setup() {
          const val = ref('1');
          const val2 = useThrottle(val);
          return {
            val,
            val2,
          };
        },
      }),
    );
    expect(component.find('#val').text()).toBe('1');
    expect(component.find('#val2').text()).toBe('1');
    component.vm.val = '2';

    await wait();
    expect(component.find('#val').text()).toBe('2');
    expect(component.find('#val2').text()).toBe('2');

    await wait();
    expect(component.find('#val').text()).toBe('2');
    expect(component.find('#val2').text()).toBe('2');
  });

  it('test wait', async () => {
    const component = mount(
      defineComponent({
        template: `
          <template>
            <span id="val">{{val}}</span>
            <span id="val2">{{val2}}</span>
          </template>
        `,
        setup() {
          const val = ref('1');
          const val2 = useThrottle(val, 100);
          return {
            val,
            val2,
          };
        },
      }),
    );
    expect(component.find('#val').text()).toBe('1');
    expect(component.find('#val2').text()).toBe('1');
    component.vm.val = '2';

    await wait();
    expect(component.find('#val').text()).toBe('2');
    expect(component.find('#val2').text()).toBe('2');

    await wait(100);
    expect(component.find('#val').text()).toBe('2');
    expect(component.find('#val2').text()).toBe('2');

    component.vm.val = '3';
    await wait(50);
    component.vm.val = '4';
    await wait(50);
    component.vm.val = '5';
    await wait(50);
    component.vm.val = '6';

    await wait();
    expect(component.find('#val').text()).toBe('6');
    expect(component.find('#val2').text()).toBe('4');

    await wait(100);
    expect(component.find('#val').text()).toBe('6');
    expect(component.find('#val2').text()).toBe('6');
  });
});
