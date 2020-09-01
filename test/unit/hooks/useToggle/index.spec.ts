import { mount } from '@vue/test-utils';
import WithoutParams from './test.withoutParams.comp.vue';
import DefaultValue from './test.defaultValue.comp.vue';

describe('useToggle', () => {
  it('simple toggle test', async () => {
    const wrapper = mount(WithoutParams);
    expect(wrapper.find('span').text()).toMatch('true');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toMatch('false');

    await wrapper.find('#boy').trigger('click');
    expect(wrapper.find('span').text()).toMatch('boy next door');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toMatch('true');

    await wrapper.find('#right').trigger('click');
    expect(wrapper.find('span').text()).toMatch('false');

    await wrapper.find('#left').trigger('click');
    expect(wrapper.find('span').text()).toMatch('true');

    wrapper.unmount();
  });

  it('defaultValue toggle test', async () => {
    const wrapper = mount(DefaultValue);
    expect(wrapper.find('span').text()).toMatch('open');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toMatch('close');

    await wrapper.find('#boy').trigger('click');
    expect(wrapper.find('span').text()).toMatch('boy next door');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toMatch('open');

    await wrapper.find('#right').trigger('click');
    expect(wrapper.find('span').text()).toMatch('close');

    await wrapper.find('#left').trigger('click');
    expect(wrapper.find('span').text()).toMatch('open');

    wrapper.unmount();
  });
});
