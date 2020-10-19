import useFavicon from '@hooks/useFavicon';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';

describe('hooks/useFavicon', () => {
  const icon =
    (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
    (() => {
      const link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
      return link;
    })();

  it('should not set the favicon when param `url` is undef', () => {
    mount(
      defineComponent({
        template: `<template />`,
        setup: () => useFavicon(),
      }),
    );

    expect(icon.href).toBe('');
  });

  it('should set the favicon when param `url` is def', () => {
    mount(
      defineComponent({
        setup: () => useFavicon('https://test.com/icon.ico'),
        template: `<template />`,
      }),
    );

    expect(icon.href).toBe('https://test.com/icon.ico');
  });

  it('should can change the favicon and restore the favicon', () => {
    icon.href = 'https://favicon.com/icon.ico';

    const component = mount(
      defineComponent({
        setup: () => useFavicon(),
        template: `<template />`,
      }),
    );

    expect(icon.href).toBe('https://favicon.com/icon.ico');

    component.vm.changeIcon('https://another.com/icon.ico');
    expect(icon.href).toBe('https://another.com/icon.ico');

    component.vm.changeIcon('1');
    expect(icon.href).toBe('http://localhost/1');

    component.vm.changeIcon('');
    expect(icon.href).toBe('http://localhost/1');

    component.vm.restoreIcon();
    expect(icon.href).toBe('https://favicon.com/icon.ico');
  });

  it('should throw error when `useFavicon` not be called inside of `setup()`', () => {
    expect(() => useFavicon()).toThrowError(
      'Invalid hook call: `useFavicon` can only be called inside of `setup()`.',
    );
  });
});
