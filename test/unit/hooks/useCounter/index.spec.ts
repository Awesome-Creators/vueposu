import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useCounter', () => {
  it('test useCounter', async () => {
    const component = mount(Test);

    component.unmount();
  });
});
