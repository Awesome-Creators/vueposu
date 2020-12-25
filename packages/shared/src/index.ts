import type { Ref } from 'vue-demi';

export type RefTyped<T> = T | Ref<T>;
export type Fn = (...args: any) => any;

export * from './utils';