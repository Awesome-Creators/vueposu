import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useClickAway', () => {
  it('test useClickAway', async () => {
    const component = mount(Test);

    expect(component.find('span').text()).toMatch('0');

    await component.vm.$nextTick();

    await component.find('span').trigger('click');
    setTimeout(() => expect(component.find('span').text()).toMatch('1'));

    await component.find('button').trigger('click');
    setTimeout(() => expect(component.find('span').text()).toMatch('1'));

    component.unmount();
  });
});
