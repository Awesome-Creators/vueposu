import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue-demi';
import { wait } from '@test/utils/helper';
import useDebounceFn from '@hooks/useDebounceFn';

describe('hooks/useDebounceFn', () => {
  it('test default case', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(1);
          const fn = useDebounceFn(() => (count.value = count.value + 1));
          return {
            count,
            fn,
          };
        },
        template: `<template />`,
      }),
    );

    // TODO: ...
  });

  it('test common case', async () => {
    const component = mount(
      defineComponent({
        setup() {
          const count = ref(1);
          const fn = useDebounceFn(() => (count.value = count.value + 1), 300);
          return {
            count,
            fn,
          };
        },
        template: `<template />`,
      }),
    );

    // TODO: ...
  });
});
