import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import useQueue from '@hooks/useQueue';

function setUp<T>(initialQueue?: T[]) {
  const component = mount(
    defineComponent({
      template: `<template />`,
      setup: () => useQueue(initialQueue),
    }),
  );
  return component;
}

describe('useQueue', () => {
  it('test not parameter', () => {
    const component = setUp();
    const { first, last, size } = component.vm;
    expect(first).toBeUndefined();
    expect(last).toBeUndefined();
    expect(size).toBe(0);
  });

  it('takes initial state', () => {
    const component = setUp([1, 2, 3]);
    const { first, last, size } = component.vm;
    expect(first).toEqual(1);
    expect(last).toEqual(3);
    expect(size).toEqual(3);
  });

  it('appends new member', () => {
    const component = setUp([1, 2]);
    component.vm.add(3);
    const { first, last, size } = component.vm;
    expect(first).toEqual(1);
    expect(last).toEqual(3);
    expect(size).toEqual(3);
  });

  it('pops oldest member', () => {
    const component = setUp([1, 2]);
    component.vm.remove();
    const { first, size } = component.vm;
    expect(first).toEqual(2);
    expect(size).toEqual(1);
  });
});
