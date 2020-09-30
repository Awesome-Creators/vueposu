import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import useDynamicList from '@hooks/useDynamicList';
import { wait } from '../../utils/helper';

describe('hooks/useDynamicList', () => {
  it('test', async () => {
    const component = mount(
      defineComponent({
        template: `<template>{{ JSON.stringify(state) }}</template>`,
        setup() {
          const [
            state,
            { push, pop, shift, deleteByIdx, sortList },
          ] = useDynamicList([1, 2, 3]);
          return { state, push, pop, shift, deleteByIdx, sortList };
        },
      }),
    );

    const checkState = async array => {
      await wait();
      console.log(component.text());
      expect(component.text()).toBe(JSON.stringify(array));
    };

    await wait();

    await checkState([1, 2, 3]);

    component.vm.push(4);
    await checkState([1, 2, 3, 4]);

    component.vm.pop();
    await checkState([1, 2, 3]);

    component.vm.shift();
    await checkState([2, 3]);

    component.vm.deleteByIdx(0);
    await checkState([3]);

    component.vm.push(2);
    expect(component.vm.sortList()).toEqual([2, 3]);
  });

  it('test initValue not array', () => {
    mount(
      defineComponent({
        template: `<template />`,
        setup() {
          try {
            expect(useDynamicList(1 as any)).toThrowError(
              'initValue should be a array',
            );
          } catch {}
        },
      }),
    );
  });
});
