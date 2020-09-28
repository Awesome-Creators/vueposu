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
            <span id="val">{{val}}</span>
            <span id="val2">{{val2}}</span>
          </template>
        `,
        setup() {
          1;
          const val = ref('1');
          const val2 = useDebounce(val);
          return {
            val,
            val2,
          };
        },
      }),
    );
    // TODO: ...
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
          const val2 = useDebounce(val, 100);
          return {
            val,
            val2,
          };
        },
      }),
    );
    // TODO: ...
  });
});
