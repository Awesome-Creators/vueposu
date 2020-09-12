import { mount } from '@vue/test-utils';
import WithoutParams from './test.withoutParams.comp.vue';
import DefaultValue from './test.defaultValue.comp.vue';

describe('hooks/useToggle', () => {
  it('simple toggle test', async () => {
    const component = mount(WithoutParams);
    const getToggleStatusText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getToggleStatusText()).toBe('true');

    await click('#toggle');
    expect(getToggleStatusText()).toBe('false');

    await click('#boy');
    expect(getToggleStatusText()).toBe('boy next door');

    await click('#toggle');
    expect(getToggleStatusText()).toBe('true');

    await click('#right');
    expect(getToggleStatusText()).toBe('false');

    await click('#left');
    expect(getToggleStatusText()).toBe('true');

    component.unmount();
  });

  it('defaultValue toggle test', async () => {
    const component = mount(DefaultValue);
    const getToggleStatusText = () => component.find('span').text();
    const click = selector => component.find(selector).trigger('click');

    expect(getToggleStatusText()).toBe('open');

    await click('#toggle');
    expect(getToggleStatusText()).toBe('close');

    await click('#boy');
    expect(getToggleStatusText()).toBe('boy next door');

    await click('#toggle');
    expect(getToggleStatusText()).toBe('open');

    await click('#right');
    expect(getToggleStatusText()).toBe('close');

    await click('#left');
    expect(getToggleStatusText()).toBe('open');

    component.unmount();
  });
});
