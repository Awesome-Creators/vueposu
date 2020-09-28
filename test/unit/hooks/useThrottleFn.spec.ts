import { mount } from '@vue/test-utils';
import { ref } from 'vue-demi';
import useThrottleFn from '@hooks/useThrottleFn';
import { wait } from '@test/utils/helper';
import { defineComponent } from 'vue-demi';

describe('hooks/useThrottleFn', () => {
  it('test default case', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const count = ref(1);
          const fn = useThrottleFn(() => (count.value = count.value + 1));
          return {
            count,
            fn,
          };
        },
      }),
    );

    // TODO: ...
  });

  it('test common case', async () => {
    const component = mount(
      defineComponent({
        template: '<template />',
        setup() {
          const count = ref(1);
          const fn = useThrottleFn(() => (count.value = count.value + 1), 300);
          return {
            count,
            fn,
          };
        },
      }),
    );

    // TODO: ...
  });
});
