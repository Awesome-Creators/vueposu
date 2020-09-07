import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useState', () => {
  it('test useState', async () => {
    const component = mount(Test);

    expect(component.find('span').text()).toBe('0');

    await component.find('button').trigger('click');

    expect(component.find('span').text()).toBe('1');

    await component.find('button').trigger('click');

    expect(component.find('span').text()).toBe('2');

    component.unmount();
  });
});
