// import { mount } from '@vue/test-utils';
// import { defineComponent, ref } from 'vue-demi';
// import useDebounce from '@hooks/useDebounce';
// import { wait } from '@test/utils/helper';

describe('hooks/useDebounce', () => {
  it('test without wait', async () => {
    // const component = mount(
    //   defineComponent({
    //     template: `
    //       <template>
    //         <span id="val">{{val}}</span>
    //         <span id="val2">{{val2}}</span>
    //       </template>
    //     `,
    //     setup() {
    //       1;
    //       const val = ref('1');
    //       const val2 = useDebounce(val);
    //       return {
    //         val,
    //         val2,
    //       };
    //     },
    //   }),
    // );
    // expect(component.find('#val').text()).toBe('1');
    // expect(component.find('#val2').text()).toBe('1');
    // component.vm.val = '2';
    // await wait();
    // expect(component.find('#val').text()).toBe('2');
    // expect(component.find('#val2').text()).toBe('2');
    // await wait();
    // expect(component.find('#val').text()).toBe('2');
    // expect(component.find('#val2').text()).toBe('2');
  });

  it('test wait', async () => {
    // mount(
    //   defineComponent({
    //     template: `
    //       <template>
    //         <span id="val">{{val}}</span>
    //         <span id="val2">{{val2}}</span>
    //       </template>
    //     `,
    //     setup() {
    //       const val = ref('1');
    //       const val2 = useDebounce(val, 100);
    //       return {
    //         val,
    //         val2,
    //       };
    //     },
    //   }),
    // );
  });
});
