import { mount } from '@vue/test-utils';
import { wait } from '../../../utils/helper';
import Common from './test.common.comp.vue';
import SideEffect from './test.sideEffect.comp.vue';

const warn = console.warn.bind(this);

describe('hooks/useTitle', () => {
  beforeAll(() => (console.warn = () => {}));
  afterAll(() => (console.warn = warn));

  it('test title', async () => {
    (window as any).testUseTitleCallback = 0;
    const component = mount(Common);
    const Sub = { name: 'Sub' };

    expect((window as any).testUseTitleCallback).toBe(1);

    // show Sub defaults to `true`.
    await component.findComponent(Sub).vm.$nextTick();
    expect(document.title).toBe('d');

    await component.find('#show').trigger('click'); // show Sub changing to `false`.
    expect(document.title).toBe('c');

    await component.find('#show').trigger('click'); // show Sub changing to `true`.
    await component.findComponent(Sub).vm.$nextTick();
    expect(document.title).toBe('d');

    expect(() => {
      (component.vm.useTitleByEvent as Function)();
    }).toThrowError(
      'Invalid hook call. Hooks can only be called inside of `setup()`',
    );

    component.unmount();
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
