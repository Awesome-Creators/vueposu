import { mount } from '@vue/test-utils';
import WithoutParams from './test.withoutParams.comp.vue';
import DefaultValue from './test.defaultValue.comp.vue';

describe('hooks/useToggle', () => {
  it('simple toggle test', async () => {
    const component = mount(WithoutParams);
    expect(component.find('span').text()).toBe('true');

    await component.find('#toggle').trigger('click');
    expect(component.find('span').text()).toBe('false');

    await component.find('#boy').trigger('click');
    expect(component.find('span').text()).toBe('boy next door');

    await component.find('#toggle').trigger('click');
    expect(component.find('span').text()).toBe('true');

    await component.find('#right').trigger('click');
    expect(component.find('span').text()).toBe('false');

    await component.find('#left').trigger('click');
    expect(component.find('span').text()).toBe('true');

    component.unmount();
  });

  it('defaultValue toggle test', async () => {
    const component = mount(DefaultValue);
    expect(component.find('span').text()).toBe('open');

    await component.find('#toggle').trigger('click');
    expect(component.find('span').text()).toBe('close');

    await component.find('#boy').trigger('click');
    expect(component.find('span').text()).toBe('boy next door');

    await component.find('#toggle').trigger('click');
    expect(component.find('span').text()).toBe('open');

    await component.find('#right').trigger('click');
    expect(component.find('span').text()).toBe('close');

    await component.find('#left').trigger('click');
    expect(component.find('span').text()).toBe('open');

    component.unmount();
  });
});
