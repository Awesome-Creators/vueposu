import useSet from '@hooks/useSet';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';

function setUp<K>(initialSet?: Set<K>) {
  const component = mount(
    defineComponent({
      template: `<template />`,
      setup: () => ({
        set: useSet(initialSet),
      }),
    }),
  );
  return component;
}

describe('hooks/useSet', () => {
  it('should init set and utils', () => {
    const { vm } = setUp(new Set([1, 2]));
    const [set, utils] = vm.set;

    expect(set.value).toEqual(new Set([1, 2]));
    expect(utils).toStrictEqual({
      has: expect.any(Function),
      add: expect.any(Function),
      remove: expect.any(Function),
      reset: expect.any(Function),
    });
  });

  it('should init empty set if no initial set provided', () => {
    const { vm } = setUp();

    expect(vm.set[0].value).toEqual(new Set());
  });

  it('should have an initially provided key', () => {
    const { vm } = setUp(new Set(['a']));
    const [, utils] = vm.set;

    let value;
    value = utils.has('a');

    expect(value).toBe(true);
  });

  it('should have an added key', () => {
    const { vm } = setUp(new Set());

    vm.set[1].add('newKey');

    let value;
    value = vm.set[1].has('newKey');

    expect(value).toBe(true);
  });

  it('should get false for non-existing key', () => {
    const { vm } = setUp(new Set(['a']));
    const [, utils] = vm.set;

    let value;
    value = utils.has('nonExisting');

    expect(value).toBe(false);
  });

  it('should add a new key', () => {
    const { vm } = setUp(new Set(['oldKey']));
    const [, utils] = vm.set;

    utils.add('newKey');

    expect(vm.set[0].value).toEqual(new Set(['oldKey', 'newKey']));
  });

  it('should work if setting existing key', () => {
    const { vm } = setUp(new Set(['oldKey']));
    const [, utils] = vm.set;

    utils.add('oldKey');

    expect(vm.set[0].value).toEqual(new Set(['oldKey']));
  });

  it('should remove existing key', () => {
    const { vm } = setUp(new Set([1, 2]));
    const [, utils] = vm.set;

    utils.remove(2);

    expect(vm.set[0].value).toEqual(new Set([1]));
  });

  it('should do nothing if removing non-existing key', () => {
    const { vm } = setUp(new Set(['a', 'b']));
    const [, utils] = vm.set;

    utils.remove('nonExisting');

    expect(vm.set[0].value).toEqual(new Set(['a', 'b']));
  });

  it('should reset to initial set provided', () => {
    const { vm } = setUp(new Set([1]));
    const [, utils] = vm.set;

    utils.add(2);

    expect(vm.set[0].value).toEqual(new Set([1, 2]));

    utils.reset();

    expect(vm.set[0].value).toEqual(new Set([1]));
  });

  it('should memoized its utils methods', () => {
    const { vm } = setUp(new Set(['a', 'b']));
    const [, utils] = vm.set;
    const { add, remove, reset } = utils;

    add('foo');

    expect(vm.set[1].add).toBe(add);
    expect(vm.set[1].remove).toBe(remove);
    expect(vm.set[1].reset).toBe(reset);
  });
});
