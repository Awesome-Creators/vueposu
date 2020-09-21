import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useTitle from '@hooks/useTitle';

describe('hooks/useTitle', () => {
  it('should be set the title', async () => {
    const defaultTitle = document.title;
    const component = mount(
      defineComponent({
        setup() {
          const title = useTitle();

          return {
            title,
            useTitle,
          };
        },
        template: `
          <div>
            <button id="change-title" @click="title = 'b'">change title</button>
          </div>
        `,
      }),
      { attachTo: document.body },
    );
    expect(document.title).toBe(defaultTitle);

    component.vm.title = 'a';
    expect(document.title).toBe('a');

    await component.find('#change-title').trigger('click');
    expect(document.title).toBe('b');

    expect(() => component.vm.useTitle('c')).toThrowError(
      'Invalid hook call. `useTitle` can only be called inside of `setup()`.',
    );
  });
});
