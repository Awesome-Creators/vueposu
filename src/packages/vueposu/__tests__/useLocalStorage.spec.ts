import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useLocalStorage from '../src/useLocalStorage';

// TODO: remove value
describe('hooks/useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('basic test', async () => {
    localStorage.setItem('a', '1');

    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useLocalStorage('a', '233');
        return { val };
      },
    });

    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useLocalStorage('a', '666');
        return { val };
      },
    });

    const component = mount(
      defineComponent({
        components: { CompA, CompB },
        template: `<CompA ref="a" />, <CompB ref="b" />`,
      }),
    );

    const compA: any = component.vm.$refs.a;
    const compB: any = component.vm.$refs.b;

    await component.vm.$nextTick();
    expect(component.text()).toBe('1, 1');
    expect(localStorage.getItem('a')).toBe('1');

    compA.val = '2';
    await component.vm.$nextTick();
    expect(compB.val).toBe('2');
    expect(component.text()).toBe('2, 2');
    expect(localStorage.getItem('a')).toBe('2');

    compA.val = null;
    await component.vm.$nextTick();
    expect(compB.val).toBe(null);
    expect(component.text()).toBe(',');
    expect(localStorage.getItem('a')).toBe(null);

    // localStorage.setItem('a', '2');
    // await component.vm.$nextTick();
    // expect(compA.val).toBe('2');
    // expect(compB.val).toBe('2');
    // expect(component.text()).toBe('2, 2');

    // localStorage.removeItem('a');
    // await component.vm.$nextTick();
    // expect(compA.val).toBe(null);
    // expect(compB.val).toBe(null);
    // expect(component.text()).toBe(',');

    component.unmount();
  });

  it('any test', async () => {
    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useLocalStorage('b', null);
        return { val };
      },
    });
    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useLocalStorage('b', null);
        return { val };
      },
    });
    const component = mount(
      defineComponent({
        components: { CompA, CompB },
        template: `<CompA ref="a" /> <CompB ref="b" />`,
      }),
    );
    const compA: any = component.vm.$refs.a;
    const compB: any = component.vm.$refs.b;

    await component.vm.$nextTick();
    expect(compA.val).toBe(null);
    expect(compB.val).toBe(null);
    expect(component.text()).toBe('');
    expect(localStorage.getItem('b')).toBe(null);

    compA.val = '1';
    await component.vm.$nextTick();
    expect(component.text()).toBe('1 1');
    expect(compA.val).toBe('1');
    expect(compB.val).toBe('1');
    expect(localStorage.getItem('b')).toBe('1');
  });

  it('should throw error when `useLocalStorage` not be called inside of `setup()`', () => {
    expect(() => useLocalStorage('key')).toThrowError(
      'Invalid hook call: `useLocalStorage` can only be called inside of `setup()`.',
    );
  });
});

