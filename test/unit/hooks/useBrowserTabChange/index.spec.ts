import { mount } from '@vue/test-utils';
import Options from './test.options.comp.vue';
import Common from './test.common.comp.vue';
import { triggerDomEvent, wait } from '../../../utils/helper';

describe('useBrowserTabChange', () => {
  beforeEach(() => {
    let val = true;
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      set($val) {
        val = $val;
      },
      get: function () {
        return val;
      },
    });
  });

  it('test options', async () => {
    const component = mount(Options);
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    // wait dom change
    await wait();
    expect(component.find('#leave').text()).toBe('true');
    expect(component.find('#back').text()).toBe('false');

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    // wait dom change
    await wait();
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');

    component.unmount();
  });

  it('test common', async () => {
    const component = mount(Common);
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');

    // leave
    triggerDomEvent('visibilitychange');
    (document as any).hidden = true;

    // wait dom change
    await wait();
    expect(component.find('#leave').text()).toBe('true');
    expect(component.find('#back').text()).toBe('false');

    // back
    triggerDomEvent('visibilitychange');
    (document as any).hidden = false;

    // wait dom change
    await wait();
    expect(component.find('#leave').text()).toBe('false');
    expect(component.find('#back').text()).toBe('true');

    component.unmount();
  });
});
