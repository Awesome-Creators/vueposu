import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import useTitle from '@hooks/useTitle';

// TODO: remove warn
const warn = console.warn.bind(this);

describe('hooks/useTitle', () => {
  beforeAll(() => (console.warn = () => {}));
  afterAll(() => (console.warn = warn));

  it('should be set the title and call side-effect function', async () => {
    let useTitleCallbackTimes = 0;

    const component = mount(
      defineComponent({
        components: {
          Sub: {
            setup() {
              useTitle('sub');
            },
            template: `<div>i m sub</div>`,
          },
        },
        setup() {
          const show = ref(true);
          useTitle('parent', () => {
            useTitleCallbackTimes++;
          });

          return {
            show,
            useTitle,
          };
        },
        template: `
          <div>
            <Sub v-if="show" />
            <button id="toggle-sub" @click="() => (show = !show)">toggle sub</button>
            <button id="change-title" @click="useTitle('i am changed')">change title</button>
          </div>
        `,
      }),
      { attachTo: document.body },
    );

    expect(component.vm.show).toBe(true);
    expect(document.title).toBe('sub');
    expect(useTitleCallbackTimes).toBe(1);

    await component.find('#toggle-sub').trigger('click');
    expect(component.vm.show).toBe(false);
    expect(document.title).toBe('parent');
    expect(useTitleCallbackTimes).toBe(2);

    await component.find('#change-title').trigger('click');
    expect(document.title).toBe('i am changed');

    await component.find('#toggle-sub').trigger('click');
    expect(component.vm.show).toBe(true);
    expect(document.title).toBe('sub');

    component.unmount();

    expect(document.title).toBe('sub');
    expect(useTitleCallbackTimes).toBe(2);
  });
});
