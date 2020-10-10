import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';
import { wait } from '@test/utils/helper';
import useWebStorage, { Serializers } from '@hooks/useWebStorage';
import useSWR from '../../../src/hooks/useSWR';

// TODO: remvoe value
describe('hooks/useWebStorage', () => {
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
    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useWebStorage('a', '1');
        return { val };
      },
    });

    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useWebStorage('a', '1');
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

    await wait();
    expect(compA.val).toBe('1');
    expect(compB.val).toBe('1');
    expect(component.text()).toBe('1 1');
    expect(localStorage.getItem('a')).toBe('1');

    compA.val = '2';
    await wait();
    expect(component.text()).toBe('2 2');
    expect(compA.val).toBe('2');
    expect(compB.val).toBe('2');
    expect(localStorage.getItem('a')).toBe('2');

    await wait();
    expect(compA.val).toBe('2');
    expect(compB.val).toBe('2');
    expect(component.text()).toBe('2 2');
    expect(localStorage.getItem('a')).toBe('2');

    // compA.val = null
    // // localStorage.removeItem('a')
    // await wait()
    // expect(compA.val).toBe(null);
    // expect(compB.val).toBe(null);

    // expect(localStorage.getItem('a')).toBeNull();

    component.unmount();
  });

  it('[localStorage]: any test', async () => {
    const CompA = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useSWR('b', () => '1');
        return { val: val.data, mutate: val.mutate };
      },
    });
    const CompB = defineComponent({
      template: `{{ val }}`,
      setup() {
        const val = useSWR('b', () => '1');
        return { val: val.data };
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

    await wait();
    expect(compA.val).toBe('1');
    expect(compB.val).toBe('1');
    expect(component.text()).toBe('1 1');

    compA.mutate('2');
    await wait();
    expect(compA.val).toBe('2');
    expect(compB.val).toBe('2');
    expect(component.text()).toBe('2 2');

    compA.mutate(null);
    await wait();
    expect(compA.val).toBe('');
    expect(compB.val).toBe('');
    expect(component.text()).toBe('');
  });

  // it('[localStorage]: any test', async () => {
  //   // const CompA = defineComponent({
  //   //   template: `{{ val }}`,
  //   //   setup() {
  //   //     const val = useWebStorage('b', null);
  //   //     return { val };
  //   //   },
  //   // });
  //   // const CompB = defineComponent({
  //   //   template: `{{ val }}`,
  //   //   setup() {
  //   //     const val = useWebStorage('b', null);
  //   //     return { val };
  //   //   },
  //   // });
  //   // const component = mount(
  //   //   defineComponent({
  //   //     components: { CompA, CompB },
  //   //     template: `<CompA ref="a" /> <CompB ref="b" />`,
  //   //   }),
  //   // );
  //   // const compA: any = component.vm.$refs.a;
  //   // const compB: any = component.vm.$refs.b;
  //   // // await wait();
  //   // console.log(compA.val);
  //   // expect(compA.val).toBe('');
  //   // expect(compB.val).toBe('');
  //   // expect(component.text()).toBe(' ');
  //   // expect(localStorage.getItem('a')).toBe('');
  //   // compA.val = '1';
  //   // await wait();
  //   // expect(component.text()).toBe('1 1');
  //   // expect(compA.val).toBe('1');
  //   // expect(compB.val).toBe('1');
  //   // expect(localStorage.getItem('a')).toBe('1');
  //   // await wait();
  //   // expect(compA.val).toBe('1');
  //   // expect(compB.val).toBe('1');
  //   // expect(component.text()).toBe('1 1');
  //   // expect(localStorage.getItem('a')).toBe('1');
  //   // component.unmount();
  // });

  // it('[sessionStorage]: basic test', async () => {
  //   const CompA = defineComponent({
  //     template: `{{ val }}`,
  //     setup() {
  //       const val = useWebStorage('a', '1', sessionStorage);
  //       return { val };
  //     },
  //   });

  //   const CompB = defineComponent({
  //     template: `{{ val }}`,
  //     setup() {
  //       const val = useWebStorage('a', '1', sessionStorage);
  //       return { val };
  //     },
  //   });

  //   const component = mount(
  //     defineComponent({
  //       components: { CompA, CompB },
  //       template: `<CompA ref="a" /> <CompB ref="b" />`,
  //     }),
  //   );

  //   const compA: any = component.vm.$refs.a;
  //   const compB: any = component.vm.$refs.b;

  //   await wait();
  //   expect(compA.val).toBe('1');
  //   expect(compB.val).toBe('1');
  //   expect(component.text()).toBe('1 1');
  //   expect(localStorage.getItem('a')).toBe('1');

  //   compA.val = '2';
  //   await wait();
  //   expect(component.text()).toBe('2 2');
  //   expect(compA.val).toBe('2');
  //   expect(compB.val).toBe('2');
  //   expect(localStorage.getItem('a')).toBe('2');

  //   await wait();
  //   expect(compA.val).toBe('2');
  //   expect(compB.val).toBe('2');
  //   expect(component.text()).toBe('2 2');
  //   expect(localStorage.getItem('a')).toBe('2');

  //   component.unmount();
  // });

  // it('[sessionStorage]: any test', async () => {
  // const CompA = defineComponent({
  //   template: `{{ val }}`,
  //   setup() {
  //     const val = useWebStorage('b',null,sessionStorage);
  //     return { val };
  //   },
  // });
  // const CompB = defineComponent({
  //   template: `{{ val }}`,
  //   setup() {
  //     const val = useWebStorage('b',null,sessionStorage);
  //     return { val };
  //   },
  // });
  // const component = mount(
  //   defineComponent({
  //     components: { CompA, CompB },
  //     template: `<CompA ref="a" /> <CompB ref="b" />`,
  //   }),
  // );
  // const compA: any = component.vm.$refs.a;
  // const compB: any = component.vm.$refs.b;
  // // await wait();
  // console.log(compA.val);
  // expect(compA.val).toBe('');
  // expect(compB.val).toBe('');
  // expect(component.text()).toBe(' ');
  // expect(localStorage.getItem('a')).toBe('');
  // compA.val = '1';
  // await wait();
  // expect(component.text()).toBe('1 1');
  // expect(compA.val).toBe('1');
  // expect(compB.val).toBe('1');
  // expect(localStorage.getItem('a')).toBe('1');
  // await wait();
  // expect(compA.val).toBe('1');
  // expect(compB.val).toBe('1');
  // expect(component.text()).toBe('1 1');
  // expect(localStorage.getItem('a')).toBe('1');
  // component.unmount();
  // });
});
