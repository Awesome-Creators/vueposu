import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import useStorage from '@hooks/useStorage';
import { Serializers } from '@hooks/useStorage/serializer';

// TODO: remvoe value
describe('hooks/useStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('serializers any', () => {
    // read
    expect(Serializers.any.read('true', false)).toBe('true');
    expect(Serializers.any.read('false', false)).toBe('false');
    expect(Serializers.any.read(null, true)).toBe(true);
    // write
    expect(Serializers.any.write(true)).toBe('true');
    expect(Serializers.any.write(false)).toBe('false');
    expect(Serializers.any.write(null)).toBe('null');
  });

  it('serializers boolean', () => {
    // read
    expect(Serializers.boolean.read('true', false)).toBe(true);
    expect(Serializers.boolean.read('false', false)).toBe(false);
    expect(Serializers.boolean.read(null, true)).toBe(true);
    // write
    expect(Serializers.boolean.write(true)).toBe('true');
    expect(Serializers.boolean.write(false)).toBe('false');
    expect(Serializers.boolean.write(null)).toBe('null');
  });

  it('serializers number', () => {
    // read
    expect(Serializers.number.read('1', 0)).toBe(1);
    expect(Serializers.number.read('1.23', 0)).toBe(1.23);
    expect(Serializers.number.read(null, 0)).toBe(0);
    // write
    expect(Serializers.number.write('1')).toBe('1');
    expect(Serializers.number.write('1.23')).toBe('1.23');
    expect(Serializers.number.write(null)).toBe('null');
  });

  it('serializers object', () => {
    // read
    expect(Serializers.object.read('{ "a": "1" }', {})).toEqual({ a: '1' });
    expect(
      Serializers.object.read('{ "a": "1", "b": { "c": "1" } }', {}),
    ).toEqual({ a: '1', b: { c: '1' } });
    expect(Serializers.object.read(null, { a: '1' })).toEqual({ a: '1' });
    // write
    expect(Serializers.object.write({ a: '1' })).toBe(
      JSON.stringify({ a: '1' }),
    );
    expect(Serializers.object.write({ a: '1', b: { c: '1' } })).toBe(
      JSON.stringify({ a: '1', b: { c: '1' } }),
    );
    expect(Serializers.object.write(null)).toBe('null');
  });

  it('serializers string', () => {
    // read
    expect(Serializers.string.read('', 'text')).toBe('');
    expect(Serializers.string.read('text', 'text 2')).toBe('text');
    expect(Serializers.string.read(null, 'text')).toBe('text');
    // write
    expect(Serializers.string.write('')).toBe('');
    expect(Serializers.string.write('text')).toBe('text');
    expect(Serializers.string.write(null)).toBe('null');
  });

  it('[localStorage]: basic test', async () => {
    localStorage.setItem('a', '1');

    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useStorage('a', '233');
        return { val };
      },
    });

    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useStorage('a', '666');
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

  it('[localStorage]: any test', async () => {
    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useStorage('b', null);
        return { val };
      },
    });
    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useStorage('b', null);
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

  it('[sessionStorage]: basic test', async () => {
    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useStorage('a', '1', sessionStorage);
        return { val };
      },
    });

    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useStorage('a', '1', sessionStorage);
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

  it('[sessionStorage]: any test', async () => {
    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useStorage('b', null, sessionStorage);
        return { val };
      },
    });
    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useStorage('b', null, sessionStorage);
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
