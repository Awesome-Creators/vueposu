import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useTitle', () => {
  it('test title', async () => {
    const component = mount(Test);

    setTimeout(() => {
      expect(document.title).toBe('d');
    }, 0);

    await component.find('#show').trigger('click');

    setTimeout(() => {
      expect(document.title).toBe('c');
    }, 0);

    await component.find('#show').trigger('click');

    setTimeout(() => {
      expect(document.title).toBe('d');
    }, 0);

    // expect(() => {
    //   component.find('#error').trigger('click');
    // }).toThrow(error => {
    //   console.log(error)
    // });

    // try {
    //   await component.find('#error').trigger('click');
    // } catch (e) {
    //   expect(e).toMatch(/Invalid hook call/);
    // }

    component.unmount();
  });
});
