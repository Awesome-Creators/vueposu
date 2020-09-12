import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';
import Limit from './test.limit.comp.vue';
import Granularity from './test.granularity.comp.vue';
import Bigint from './test.bigint.comp.vue';
import Any from './test.any.comp.vue';

describe('hooks/useCounter', () => {
  it('test useCounter', async () => {
    const component = mount(Test);
    const getCountText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getCountText()).toBe('0.2');

    await click('#inc');
    expect(getCountText()).toBe('0.3');

    await click('#dec');
    expect(getCountText()).toBe('-0.7');

    await click('#set');
    expect(getCountText()).toBe('8');

    await click('#set-with-callback');
    expect(getCountText()).toBe('10');

    await click('#reset');
    expect(getCountText()).toBe('0.2');

    component.unmount();
  });

  it('test useCounter min limit and max limit', async () => {
    const component = mount(Limit);
    const getCountText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getCountText()).toBe('0');

    await click('#inc');
    expect(getCountText()).toBe('2');

    await click('#dec');
    expect(getCountText()).toBe('1');

    await click('#reset');
    expect(getCountText()).toBe('0');

    await click('#set');
    expect(getCountText()).toBe('2');

    component.unmount();
  });

  it('test useCounter granularity', async () => {
    const component = mount(Granularity);
    const getCountText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getCountText()).toBe('0.2');

    await click('#inc');
    expect(getCountText()).toBe('0.3');

    await component.find('#set-callback').trigger('click');
    expect(getCountText()).toBe('0.4');

    await click('#dec');
    expect(getCountText()).toBe('0.3');

    await component.find('#dec-to-min').trigger('click');
    expect(getCountText()).toBe('0');

    await click('#reset');
    expect(getCountText()).toBe('0.2');

    component.unmount();
  });

  it('test useCounter bigint', async () => {
    const component = mount(Bigint);
    const getCountText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getCountText()).toBe('11');

    await click('#set');
    expect(getCountText()).toBe('2');

    await click('#inc');
    expect(getCountText()).toBe('3');

    await click('#dec');
    expect(getCountText()).toBe('1');

    await click('#reset');
    expect(getCountText()).toBe('11');

    component.unmount();
  });

  it('mock js user', async () => {
    const component = mount(Any);
    const getCountText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getCountText()).toBe('0');

    await click('#inc');
    expect(getCountText()).toBe('0.1');

    await click('#dec');
    expect(getCountText()).toBe('-0.9');

    await click('#set');
    expect(getCountText()).toBe('8');

    await click('#set-with-callback');
    expect(getCountText()).toBe('10');

    await click('#reset');
    expect(getCountText()).toBe('0');

    component.unmount();
  });
});
