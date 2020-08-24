import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useToggle', () => {
  it('test toggle', async () => {
    const wrapper = mount(Test);

    expect(wrapper.find('span').text()).toMatch('false');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toMatch('true');

    await wrapper.find('#boy').trigger('click');
    expect(wrapper.find('span').text()).toMatch('boy next door');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toMatch('false');

    await wrapper.find('#right').trigger('click');
    expect(wrapper.find('span').text()).toMatch('true');

    await wrapper.find('#left').trigger('click');
    expect(wrapper.find('span').text()).toMatch('false');

    wrapper.unmount();
  });
});
