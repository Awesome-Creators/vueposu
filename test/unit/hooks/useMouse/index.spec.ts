import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

// TODO:
describe('hooks/useMouse', () => {
  it('test useMouse', async () => {
    const component = mount(Test);

    // const pageX = () => component.find('#page-x').text();
    // const pageY = () => component.find('#page-y').text();
    // const screenX = () => component.find('#screen-x').text();
    // const screenY = () => component.find('#screen-y').text();
    // const clientX = () => component.find('#client-x').text();
    // const clientY = () => component.find('#client-y').text();
    // const move = (x: number, y: number) => {
    //   document.dispatchEvent(
    //     new MouseEvent('mousemove', {
    //       clientX: x,
    //       clientY: y,
    //       screenX: x,
    //       screenY: y,
    //     }),
    //   );
    // };

    // move(100, 100);

    // expect(pageX()).toEqual(100);
    // expect(pageY()).toEqual(100);
    // expect(screenX()).toEqual(100);
    // expect(screenY()).toEqual(100);
    // expect(clientX()).toEqual(100);
    // expect(clientY()).toEqual(100);

    component.unmount();
  });
});
