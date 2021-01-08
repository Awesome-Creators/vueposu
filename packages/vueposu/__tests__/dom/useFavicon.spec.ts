import { useFavicon } from 'vueposu';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';

describe('dom/useFavicon', () => {
  const getIcon = () =>
    document.querySelector("link[rel*='icon']") as HTMLLinkElement;
  getIcon()?.parentNode.removeChild(getIcon());

  it('should not set the favicon when param `url` is undef', () => {
    mount(
      defineComponent({
        template: `<template />`,
        setup: () => useFavicon(),
      }),
    );

    expect(getIcon().href).toBe('');
  });

  it('should set the favicon when param `url` is def', () => {
    mount(
      defineComponent({
        setup: () => useFavicon('https://test.com/icon.ico'),
        template: `<template />`,
      }),
    );

    expect(getIcon().href).toBe('https://test.com/icon.ico');
  });

  it('should can change the favicon and restore the favicon', () => {
    const icon = getIcon();
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
