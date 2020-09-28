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
          const val2 = useThrottle(val, 100);
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
