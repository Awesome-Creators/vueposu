import { mount } from '@vue/test-utils';
import { wait } from '@test/utils/helper';
import Common from './test.common.comp.vue';
import SideEffect from './test.sideEffect.comp.vue';

// TODO: remove warn
const warn = console.warn.bind(this);

describe('hooks/useTitle', () => {
  beforeAll(() => (console.warn = () => {}));
  afterAll(() => (console.warn = warn));

  it('test title', async () => {
    (window as any).testUseTitleCallback = 0;
    const defaultTitle = document.title;

    const component = mount(Common);
    const Sub = { name: 'Sub' };

    expect((window as any).testUseTitleCallback).toBe(1);

    expect(document.title).toBe('c');

    // show Sub defaults to `false`, and its changing to `true`.
    await component.find('#show').trigger('click');
    await component.findComponent(Sub).vm.$nextTick();
    expect(document.title).toBe('d');

    // show Sub changing to `false`.
    await component.find('#show').trigger('click');
    expect(document.title).toBe('c');

    expect(() => {
      (component.vm.useTitleByEvent as Function)();
    }).toThrowError(
      'Invalid hook call. Hooks can only be called inside of `setup()`',
    );

    component.unmount();
    expect(document.title).toBe(defaultTitle);
  });

  it('test sideEffect', async () => {
    (window as any).testUseTitleSideEffect = 0;

    document.title = 'a';
    const component = mount(SideEffect);

    await wait();
    expect((window as any).testUseTitleSideEffect).toBe(0);

    component.unmount();
  });
});
