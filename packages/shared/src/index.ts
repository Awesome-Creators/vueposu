import type { Ref } from 'vue-demi';

export * from './utils';

export type RefTyped<T> = T | Ref<T>;
export type Fn = (...args: any) => any;