import { mount } from '@vue/test-utils';
import Default from './test.default.comp.vue';
import Common from './test.common.comp.vue';
import { wait } from '@test/utils/helper';

describe('hooks/useDebounce', () => {
  it('test default case', async () => {
    const component = mount(Default);

    await component.find('#trigger').trigger('click');
    await wait();
    expect(component.find('#count').text()).toBe('2');

    // multiple test
    await component.find('#trigger').trigger('click');
    await wait();

    await component.find('#trigger').trigger('click');
    await wait();

    await component.find('#trigger').trigger('click');
    await wait();

    expect(component.find('#count').text()).toBe('5');

    // cancel test
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#cancel').trigger('click');
    await wait();
    expect(component.find('#count').text()).toBe('5');

    component.unmount();
  });

  it('test common case', async () => {
    const component = mount(Common);
    await component.find('#trigger').trigger('click');

    await wait();
    expect(component.find('#count').text()).toBe('1');
    await wait(210);
    expect(component.find('#count').text()).toBe('1');
    await wait(310);
    expect(component.find('#count').text()).toBe('2');

    // multiple test
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');

    await wait();
    expect(component.find('#count').text()).toBe('2');

    await wait(210);
    expect(component.find('#count').text()).toBe('2');

    await wait(310);
    expect(component.find('#count').text()).toBe('3');

    // cancel test
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');
    await component.find('#trigger').trigger('click');

    await component.find('#cancel').trigger('click');

    await wait();
    expect(component.find('#count').text()).toBe('3');

    await wait(210);
    expect(component.find('#count').text()).toBe('3');

    await wait(310);
    expect(component.find('#count').text()).toBe('3');

    component.unmount();
  });
});
