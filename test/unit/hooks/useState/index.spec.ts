import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';
import CallbackTest from './test.callback.comp.vue';

describe('hooks/useState', () => {
  it('test useState', async () => {
    const component = mount(Test);

    expect(component.find('span').text()).toBe('0');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('2');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('0');

    component.unmount();
  });

  it('test useState callback', async () => {
    const component = mount(CallbackTest);

    expect(component.find('span').text()).toBe('0');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('2');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('0');

    component.unmount();
  });
});
