import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import { useSessionStorage } from ".";

// TODO: remove value
describe('hooks/useSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('basic test', async () => {
    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useSessionStorage('a', '1');
        return { val };
      },
    });

    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useSessionStorage('a', '1');
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
    expect(compA.val).toBe('1');
    expect(compB.val).toBe('1');
    expect(component.text()).toBe('1 1');
    expect(sessionStorage.getItem('a')).toBe('1');

    compA.val = '2';
    await component.vm.$nextTick();
    expect(component.text()).toBe('2 2');
    expect(compA.val).toBe('2');
    expect(compB.val).toBe('2');
    expect(sessionStorage.getItem('a')).toBe('2');

    component.unmount();
  });

  it('any test', async () => {
    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useSessionStorage('b', null);
        return { val };
      },
    });
    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useSessionStorage('b', null);
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
    expect(sessionStorage.getItem('b')).toBe(null);

    compA.val = '1';
    await component.vm.$nextTick();
    expect(component.text()).toBe('1 1');
    expect(compA.val).toBe('1');
    expect(compB.val).toBe('1');
    expect(sessionStorage.getItem('b')).toBe('1');
    component.unmount();
  });
});
