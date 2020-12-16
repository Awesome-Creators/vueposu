import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import { useVModel } from '../../../src/hooks/useVModel';
import { wait } from '../../utils/helper';

// TODO: need more test case
describe('hooks/useVModel', () => {
  it('official demo should work', async () => {
    // @see demo: https://vuejs.org/v2/guide/components-custom-events.html
    const BaseCheckbox = defineComponent({
      template: `
        <input
        type="checkbox"
        v-bind:checked="checked"
        v-on:change="update">
      `,
      model: {
        prop: 'modelValue',
        event: 'change',
      },
      props: {
        modelValue: Boolean,
      },
      setup(props) {
        const checked = useVModel(props, 'modelValue');
        const update = event => {
          const checkbox = event.target as HTMLInputElement;
          checked.value = checkbox.checked;
          console.log(checked.value, checkbox.checked);
        };
        return { checked, update };
      },
    });

    const component = mount(
      defineComponent({
        components: { BaseCheckbox },
        template: `<BaseCheckbox v-model="checked" />`,
        setup() {
          const checked = ref(false);
          return { checked };
        },
      }),
    );

    expect(component.vm.checked).toBe(false);
    component.find('input').trigger('click');
    await wait();
    expect(component.vm.checked).toBe(true);
  });
});
