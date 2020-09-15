import { mount } from '@vue/test-utils';
import Default from './test.default.comp.vue';
import Common from './test.common.comp.vue';
import { wait } from '@test/utils/helper';

describe('hooks/useThrottle', () => {
  it('test default case', async () => {
    const component = mount(Default);
    const getCountText = () => component.find('#count').text();
    const click = selector => component.find(selector).trigger('click');

    await click('#trigger');
    await wait();
    expect(getCountText()).toBe('2');

    // multiple test
    await click('#trigger');
    await wait();

    await click('#trigger');
    await wait();

    await click('#trigger');
    await wait();

    expect(getCountText()).toBe('5');

    // cancel test
    await click('#trigger');
    await click('#trigger');
    await click('#trigger');
    await click('#cancel');
    await wait();
    expect(getCountText()).toBe('8');

    component.unmount();
  });

  it('test common case', async () => {
    const component = mount(Common);
    const getCountText = () => component.find('#count').text();
    const click = selector => component.find(selector).trigger('click');

    await click('#trigger');

    await wait();
    expect(getCountText()).toBe('2');

    await wait(210);
    expect(getCountText()).toBe('2');

    await wait(310);
    expect(getCountText()).toBe('2');

    // multiple test
    await click('#trigger');
    await click('#trigger');
    await click('#trigger');
    await click('#trigger');

    await wait();
    expect(getCountText()).toBe('3');

    await wait(210);
    expect(getCountText()).toBe('3');

    await wait(310);
    expect(getCountText()).toBe('4');

    // cancel test
    await click('#trigger');
    await click('#trigger');
    await click('#trigger');
    await click('#trigger');
    await click('#cancel');

    await wait();
    expect(getCountText()).toBe('5');

    await wait(210);
    expect(getCountText()).toBe('5');

    await wait(310);
    expect(getCountText()).toBe('5');

    component.unmount();
  });
});
