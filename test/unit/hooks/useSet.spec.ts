import useSet from '@hooks/useSet';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';

function setUp<K>(initialSet?: Set<K>) {
  return mount(
    defineComponent({
      template: `<template />`,
      setup: () => ({
        set: useSet(initialSet)
      }),
    }),
  );
}

describe('hooks/useSet', () => {
  it('should init set and utils', () => {
    const { set, ...utils } = setUp(new Set([1, 2])).vm.set;

    expect(set.value).toEqual(new Set([1, 2]));
    expect(utils).toStrictEqual({
      has: expect.any(Function),
      add: expect.any(Function),
      remove: expect.any(Function),
      reset: expect.any(Function),
    });
  });

  it('should init empty set if no initial set provided', () => {
    const { set } = setUp().vm.set;

    expect(set.value).toEqual(new Set());
  });

  it('should have an initially provided key', () => {
    const { has } = setUp(new Set(['a'])).vm.set;

    expect(has('a')).toBe(true);
  });

  it('should have an added key', () => {
    const { add, has } = setUp(new Set()).vm.set;

    add('newKey');
    expect(has('newKey')).toBe(true);
  });

  it('should get false for non-existing key', () => {
    const { has } = setUp(new Set(['a'])).vm.set;

    expect(has('nonExisting')).toBe(false);
  });

  it('should add a new key', () => {
    const { set, add } = setUp(new Set(['oldKey'])).vm.set;

    add('newKey');
    expect(set.value).toEqual(new Set(['oldKey', 'newKey']));
  });

  it('should work if setting existing key', () => {
    const { set, add } = setUp(new Set(['oldKey'])).vm.set;

    add('oldKey');
    expect(set.value).toEqual(new Set(['oldKey']));
  });

  it('should remove existing key', () => {
    const { set, remove } = setUp(new Set([1, 2])).vm.set;

    remove(2);
    expect(set.value).toEqual(new Set([1]));
  });

  it('should do nothing if removing non-existing key', () => {
    const { set, remove } = setUp(new Set(['a', 'b'])).vm.set;

    remove('nonExisting');
    expect(set.value).toEqual(new Set(['a', 'b']));
  });

  it('should reset to initial set provided', () => {
    const { set, add, reset } = setUp(new Set([1])).vm.set;

    add(2);
    expect(set.value).toEqual(new Set([1, 2]));

    reset();
    expect(set.value).toEqual(new Set([1]));
  });
});
