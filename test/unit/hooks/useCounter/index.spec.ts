import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';
import Limit from './test.limit.comp.vue';
import Granularity from './test.granularity.comp.vue';
import Bigint from './test.bigint.comp.vue';

describe('useCounter', () => {
  it('test useCounter', async () => {
    const component = mount(Test);

    expect(component.find('span').text()).toBe('0.2');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('0.3');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('-0.7');

    await component.find('#set').trigger('click');
    expect(component.find('span').text()).toBe('8');

    await component.find('#set-with-callback').trigger('click');
    expect(component.find('span').text()).toBe('10');

    await component.find('#reset').trigger('click');
    expect(component.find('span').text()).toBe('0.2');

    component.unmount();
  });

  it('test useCounter min limit and max limit', async () => {
    const component = mount(Limit);

    expect(component.find('span').text()).toBe('0');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('2');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.find('#reset').trigger('click');
    expect(component.find('span').text()).toBe('0');

    await component.find('#set').trigger('click');
    expect(component.find('span').text()).toBe('2');

    component.unmount();
  });

  it('test useCounter granularity', async () => {
    const component = mount(Granularity);

    expect(component.find('span').text()).toBe('0.2');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('0.3');

    await component.find('#set-callback').trigger('click');
    expect(component.find('span').text()).toBe('0.4');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('0.3');

    await component.find('#dec-to-min').trigger('click');
    expect(component.find('span').text()).toBe('0');

    await component.find('#reset').trigger('click');
    expect(component.find('span').text()).toBe('0.2');

    component.unmount();
  });

  it('test useCounter bigint', async () => {
    const component = mount(Bigint);

    expect(component.find('span').text()).toBe('11');

    await component.find('#set').trigger('click');
    expect(component.find('span').text()).toBe('2');

    await component.find('#inc').trigger('click');
    expect(component.find('span').text()).toBe('3');

    await component.find('#dec').trigger('click');
    expect(component.find('span').text()).toBe('1');

    await component.find('#reset').trigger('click');
    expect(component.find('span').text()).toBe('11');

    component.unmount();
  });
});
