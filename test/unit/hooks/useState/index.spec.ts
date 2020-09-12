import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';
import CallbackTest from './test.callback.comp.vue';

describe('hooks/useState', () => {
  it('test useState', async () => {
    const component = mount(Test);
    const getStateText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getStateText()).toBe('0');

    await click('#inc');
    expect(getStateText()).toBe('1');

    await click('#inc');
    expect(getStateText()).toBe('2');

    await click('#dec');
    expect(getStateText()).toBe('1');

    await click('#dec');
    expect(getStateText()).toBe('0');

    component.unmount();
  });

  it('test useState callback', async () => {
    const component = mount(CallbackTest);
    const getStateText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getStateText()).toBe('0');

    await click('#inc');
    expect(getStateText()).toBe('1');

    await click('#inc');
    expect(getStateText()).toBe('2');

    await click('#dec');
    expect(getStateText()).toBe('1');

    await click('#dec');
    expect(getStateText()).toBe('0');

    component.unmount();
  });
});
