import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useTitle from '@hooks/useTitle';
import { wait } from '@test/utils/helper';

describe('hooks/useTitle', () => {
  const $mutationObserver = window.MutationObserver;
  const constructorFn = jest.fn();
  const observeFn = jest.fn();
  const disconnectFn = jest.fn();

  const mockMutationObserver = () => {
    class MutationObserver {
      constructor() {
        constructorFn();
      }
      observe = observeFn;
      disconnect = disconnectFn;
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
  };

  const restoreMutationObserver = () => {
    Object.defineProperty(window, 'MutationObserver', {
      writable: true,
      configurable: true,
      value: $mutationObserver,
    });
    Object.defineProperty(global, 'MutationObserver', {
      writable: true,
      configurable: true,
      value: $mutationObserver,
    });
  };

  const originalTitle = document.title;
  const getComponent = (...args: Parameters<typeof useTitle>) =>
    mount(
      defineComponent({
        setup() {
          return useTitle(...args);
        },
        template: `<div></div>`,
      }),
    );

  beforeEach(() => {
    restoreMutationObserver();
  });

  it('should observe the `document.title`', () => {
    mockMutationObserver();
    getComponent();

    expect(constructorFn).toHaveBeenCalled();
    expect(observeFn).toHaveBeenCalled();
  });

  it('should set the title when change `title` ref value', () => {
    const component = getComponent();

    expect(document.title).toBe(originalTitle);

    component.vm.title = 'a';
    expect(document.title).toBe('a');

    component.unmount();
  });

  it('should override the current title', () => {
    const component = getComponent('b');

    expect(component.vm.title).toBe('b');
    expect(document.title).toBe('b');

    component.unmount();
  });

  it('should restore the title', () => {
    const component = getComponent('c');

    expect(component.vm.title).toBe('c');
    expect(document.title).toBe('c');

    component.vm.restoreTitle();
    expect(component.vm.title).toBe(originalTitle);
    expect(document.title).toBe(originalTitle);

    component.unmount();
  });

  it('should be updated if the `document.title` changes', async () => {
    const component = getComponent();

    expect(component.vm.title).toBe(originalTitle);
    expect(document.title).toBe(originalTitle);

    document.title = 'd';
    await wait();
    expect(component.vm.title).toBe('d');

    component.unmount();
  });

  it('should restore the title and disconnect observe on unmount', () => {
    mockMutationObserver();
    const component = getComponent('f');

    expect(disconnectFn).not.toHaveBeenCalled();

    component.unmount();
    expect(disconnectFn).toHaveBeenCalled();
  });

  it('should not restore the title on unmount when param `restoreOnUnmount` is `false`', () => {
    const component = getComponent('e', false);

    expect(component.vm.title).toBe('e');
    expect(document.title).toBe('e');

    component.unmount();
    expect(document.title).toBe('e');
  });

  it('should throw error when `useTitle` not be called inside of `setup()`', () => {
    expect(() => useTitle('g')).toThrowError(
      'Invalid hook call: `useTitle` can only be called inside of `setup()`.',
    );
  });
});
