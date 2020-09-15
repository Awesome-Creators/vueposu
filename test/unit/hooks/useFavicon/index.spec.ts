import useFavicon from '@hooks/useFavicon';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

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
        template: `
          <template>
            <div id="click" @click="changeIcon('https://www.another.com/icon.ico')">testing</div>
            <div id="empty" @click="changeIcon(1)">testing</div>
            <div id="emptyII" @click="changeIcon()">testing</div>
          </template>
      `,
      }),
    );

    expect(
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement).href,
    ).toBe('https://www.test.com/icon.ico');

    await component.find('#click').trigger('click');
    expect(
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement).href,
    ).toBe('https://www.another.com/icon.ico');

    await component.find('#empty').trigger('click');
    expect(
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement).href,
    ).toBe('http://localhost/1');

    await component.find('#emptyII').trigger('click');
    expect(
      (document.querySelector("link[rel*='icon']") as HTMLLinkElement).href,
    ).toBe('http://localhost/1');

    component.unmount();
  });
});
