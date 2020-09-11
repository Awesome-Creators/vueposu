import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';
import Initializer from './test.init.comp.vue';

describe('useState', () => {
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

  it('test useReducer initializer', async () => {
    const component = mount(Initializer);

    expect(component.find('span').text()).toBe('8');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('9');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('10');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('9');

    await component.find('#reset').trigger('click');
    expect(component.find('span').text()).toBe('8');

    component.unmount();
  });
});
