import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useRequest', () => {
  it('test', () => {
    const component = mount(Test);

    component.unmount();
  });
});
