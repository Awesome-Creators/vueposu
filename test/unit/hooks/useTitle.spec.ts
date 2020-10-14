import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useTitle from '@hooks/useTitle';
import { wait } from '@test/utils/helper';

describe('hooks/useTitle', () => {
  const $mutationObserver = window.MutationObserver;
  const constructorFn = jest.fn();
  const observeFn = jest.fn();
  const disconnectFn = jest.fn();
  class MutationObserver {
    observer: any;
    constructor(callback: MutationCallback) {
      this.observer = new $mutationObserver(callback);
      constructorFn();
    }
    observe = (...args) => {
      this.observer.observe(...args);
      observeFn();
    };
    disconnect = (...args) => {
      this.observer.disconnect(...args);
      disconnectFn();
    };
  }
  Object.defineProperty(window, 'MutationObserver', {
    writable: true,
    configurable: true,
    value: MutationObserver,
  });
  Object.defineProperty(global, 'MutationObserver', {
    writable: true,
    configurable: true,
    value: MutationObserver,
  });

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

  it('should observe the `document.title`', () => {
    expect(constructorFn).toHaveBeenCalled();
    expect(observeFn).toHaveBeenCalled();
  });

  it('should set title', async () => {
    expect(document.title).toBe(defaultTitle);

    component.vm.title = 'a';
    expect(document.title).toBe('a');

    await component.find('#change-title').trigger('click');
    expect(document.title).toBe('b');
  });

  it('should be updated if the `document.title` changes', async () => {
    document.title = 'c';
    await wait();
    expect(component.vm.title).toBe('c');
  });

  it('should throw error when `useTitle` not be called inside of `setup()`', () => {
    expect(() => component.vm.useTitle('d')).toThrowError(
      'Invalid hook call: `useTitle` can only be called inside of `setup()`.',
    );
  });

  it('should disconnect observe on unmount', () => {
    expect(disconnectFn).not.toHaveBeenCalled();

    component.unmount();
    expect(disconnectFn).toHaveBeenCalled();
  });
});
