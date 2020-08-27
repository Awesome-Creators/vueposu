import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useTitle', () => {
  it('test title', async () => {
    const component = mount(Test);

    await component.vm.$nextTick();
    expect(document.title).toBe('d');

    await component.find('#show').trigger('click');
    expect(document.title).toBe('c');

    await component.find('#show').trigger('click');
    expect(document.title).toBe('d');

    expect(
      async () => await component.find('#error').trigger('click'),
    ).toThrowError(Error);

    component.unmount();
  });
});
