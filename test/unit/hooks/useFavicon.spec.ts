import useFavicon from '@hooks/useFavicon';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';

describe('hooks/useFavicon', () => {
  it('test useFavicon', async () => {
    const component = mount(
      defineComponent({
        template: `<template />`,
        setup: () => ({ useFavicon: useFavicon() }),
      }),
    );

    expect(document.querySelector("link[rel*='icon']") as HTMLLinkElement).toBe(
      null,
    );

    component.unmount();
  });

  it('test useFavicon', async () => {
    const component = mount(
      defineComponent({
        setup: () => ({
          changeIcon: useFavicon('https://www.test.com/icon.ico')[0],
        }),
        template: `<template />`,
      }),
    );

    expect(
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement).href,
    ).toBe('https://www.test.com/icon.ico');

    component.vm.changeIcon('https://www.another.com/icon.ico');
    expect(
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement).href,
    ).toBe('https://www.another.com/icon.ico');

    component.vm.changeIcon('1');
    expect(
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement).href,
    ).toBe('http://localhost/1');

    component.vm.changeIcon('');
    expect(
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement).href,
    ).toBe('http://localhost/1');

    component.unmount();
  });
});
