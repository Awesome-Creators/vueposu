import useSet from '@hooks/useSet';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue-demi';

const setup = (initialSet?: any) =>
  mount(
    defineComponent({
      template: `<template />`,
      setup: () => ({
        set: useSet(initialSet),
      }),
    }),
  );

describe('hooks/useSet', () => {
  it('should init set and utils', () => {
    const { set, ...utils } = setup(new Set([1, 2])).vm.set;

    expect(set.value).toEqual(new Set([1, 2]));
    expect(utils).toStrictEqual({
      add: expect.any(Function),
      remove: expect.any(Function),
      has: expect.any(Function),
      reset: expect.any(Function),
      clear: expect.any(Function),
    });
  });

  it('should init empty set if no initial set provided', () => {
    const { set } = setup().vm.set;

    expect(set.value).toEqual(new Set());
  });

  it('should have an initially provided key', () => {
    const { has } = setup(new Set(['a'])).vm.set;

    expect(has('a')).toBe(true);
  });

  it('should have an added key', () => {
    const { add, has } = setup(new Set()).vm.set;

    add('newKey');
    expect(has('newKey')).toBe(true);
  });

  it('should get false for non-existing key', () => {
    const { has } = setup(new Set(['a'])).vm.set;

    expect(has('nonExisting')).toBe(false);
  });

  it('should add a new key', () => {
    const { set, add } = setup(new Set(['oldKey'])).vm.set;

    add('newKey');
    expect(set.value).toEqual(new Set(['oldKey', 'newKey']));
  });

  it('should work if setting existing key', () => {
    const { set, add } = setup(new Set(['oldKey'])).vm.set;

    add('oldKey');
    expect(set.value).toEqual(new Set(['oldKey']));
  });

  it('should remove existing key', () => {
    const { set, remove } = setup(new Set([1, 2])).vm.set;

    remove(2);
    expect(set.value).toEqual(new Set([1]));
  });

  it('should do nothing if removing non-existing key', () => {
    const { set, remove } = setup(new Set(['a', 'b'])).vm.set;

    remove('nonExisting');
    expect(set.value).toEqual(new Set(['a', 'b']));
  });

  it('should reset to initial set provided', () => {
    const { set, add, reset } = setup(new Set([1])).vm.set;

    add(2);
    expect(set.value).toEqual(new Set([1, 2]));

    reset();
    expect(set.value).toEqual(new Set([1]));
  });

  it('should clear all keys', () => {
    const { set, add, clear } = setup(new Set([1, 2])).vm.set;

    add(3);
    expect(set.value).toEqual(new Set([1, 2, 3]));

    clear();
    expect(set.value).toEqual(new Set([]));
  });

  it('should throw error when `useSet` not be called inside of `setup()`', () => {
    expect(() => useSet()).toThrowError(
      'Invalid hook call: `useSet` can only be called inside of `setup()`.',
    );
  });
});
