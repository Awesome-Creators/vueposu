import { mount } from '@vue/test-utils';
import WithoutParams from './test.withoutParams.comp.vue';
import DefaultValue from './test.defaultValue.comp.vue';

describe('useToggle', () => {
  it('simple toggle test', async () => {
    const wrapper = mount(WithoutParams);
    expect(wrapper.find('span').text()).toBe('true');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toBe('false');

    await wrapper.find('#boy').trigger('click');
    expect(wrapper.find('span').text()).toBe('boy next door');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toBe('true');

    await wrapper.find('#right').trigger('click');
    expect(wrapper.find('span').text()).toBe('false');

    await wrapper.find('#left').trigger('click');
    expect(wrapper.find('span').text()).toBe('true');

    wrapper.unmount();
  });

  it('defaultValue toggle test', async () => {
    const wrapper = mount(DefaultValue);
    expect(wrapper.find('span').text()).toBe('open');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toBe('close');

    await wrapper.find('#boy').trigger('click');
    expect(wrapper.find('span').text()).toBe('boy next door');

    await wrapper.find('#toggle').trigger('click');
    expect(wrapper.find('span').text()).toBe('open');

    await wrapper.find('#right').trigger('click');
    expect(wrapper.find('span').text()).toBe('close');

    await wrapper.find('#left').trigger('click');
    expect(wrapper.find('span').text()).toBe('open');

    wrapper.unmount();
  });
});
