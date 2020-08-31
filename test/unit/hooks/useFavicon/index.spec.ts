import { mount } from '@vue/test-utils';
import Test from './test.comp.vue';

describe('useFavicon', () => {
  it('test useFavicon', async () => {
    const component = mount(Test);

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
  });
});
