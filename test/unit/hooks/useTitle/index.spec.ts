import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useTitle', () => {
  it('test title', async () => {
    const component = mount(Test);
    const Sub = { name: 'Sub' };

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
    }).toThrowError();

    component.unmount();
  });
});
