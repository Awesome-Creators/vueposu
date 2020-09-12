import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('hooks/useMouse', () => {
  it('test useMouse', async () => {
    const component = mount(Test);

    const pageX = () => component.find('#page-x').text();
    const pageY = () => component.find('#page-y').text();
    const screenX = () => component.find('#screen-x').text();
    const screenY = () => component.find('#screen-y').text();
    const clientX = () => component.find('#client-x').text();
    const clientY = () => component.find('#client-y').text();

    component.unmount();
  });
});
