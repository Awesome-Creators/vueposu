// import { mount } from '@vue/test-utils';
// import { defineComponent } from 'vue-demi';
// import { wait } from '@test/utils/helper';
// import useSessionStorage from '@hooks/useSessionStorage';

// // TODO: remove value
// describe('hooks/useSessionStorage', () => {
//   beforeEach(() => {
//     localStorage.clear();
//   });

//   it('[localStorage]: basic test', async () => {
//     const CompA = defineComponent({
//       template: `{{ val }}`,
//       setup() {
//         const val = useSessionStorage('a', '1');
//         return { val };
//       },
//     });

//     const CompB = defineComponent({
//       template: `{{ val }}`,
//       setup() {
//         const val = useSessionStorage('a', '1');
//         return { val };
//       },
//     });

//     const component = mount(
//       defineComponent({
//         components: { CompA, CompB },
//         template: `<CompA ref="a" /> <CompB ref="b" />`,
//       }),
//     );

//     const compA: any = component.vm.$refs.a;
//     const compB: any = component.vm.$refs.b;

//     await wait();
//     expect(compA.val).toBe('1');
//     expect(compB.val).toBe('1');
//     expect(component.text()).toBe('1 1');
//     expect(localStorage.getItem('a')).toBe('1');

//     compA.val = '2';
//     await wait();
//     expect(component.text()).toBe('2 2');
//     expect(compA.val).toBe('2');
//     expect(compB.val).toBe('2');
//     expect(localStorage.getItem('a')).toBe('2');

//     await wait();
//     expect(compA.val).toBe('2');
//     expect(compB.val).toBe('2');
//     expect(component.text()).toBe('2 2');
//     expect(localStorage.getItem('a')).toBe('2');

//     component.unmount();
//   });

//   it('[localStorage]: any test', async () => {
//     // const CompA = defineComponent({
//     //   template: `{{ val }}`,
//     //   setup() {
//     //     const val = useSessionStorage('b', null);
//     //     return { val };
//     //   },
//     // });
//     // const CompB = defineComponent({
//     //   template: `{{ val }}`,
//     //   setup() {
//     //     const val = useSessionStorage('b', null);
//     //     return { val };
//     //   },
//     // });
//     // const component = mount(
//     //   defineComponent({
//     //     components: { CompA, CompB },
//     //     template: `<CompA ref="a" /> <CompB ref="b" />`,
//     //   }),
//     // );
//     // const compA: any = component.vm.$refs.a;
//     // const compB: any = component.vm.$refs.b;
//     // // await wait();
//     // console.log(compA.val);
//     // expect(compA.val).toBe('');
//     // expect(compB.val).toBe('');
//     // expect(component.text()).toBe(' ');
//     // expect(localStorage.getItem('a')).toBe('');
//     // compA.val = '1';
//     // await wait();
//     // expect(component.text()).toBe('1 1');
//     // expect(compA.val).toBe('1');
//     // expect(compB.val).toBe('1');
//     // expect(localStorage.getItem('a')).toBe('1');
//     // await wait();
//     // expect(compA.val).toBe('1');
//     // expect(compB.val).toBe('1');
//     // expect(component.text()).toBe('1 1');
//     // expect(localStorage.getItem('a')).toBe('1');
//     // component.unmount();
//   });
// });
