import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useEffect', () => {
  it('test useEffect', async () => {
    const component = mount(Test);

    component.unmount();
  });
});
