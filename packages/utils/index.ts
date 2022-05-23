import type { Ref } from 'vue-demi';
import * as fullscreen from './fullscreen';

export * from './helper';
export * from './math';

export * from './dom';
export * from './emitter';

export * from './hash';
export * from './isDocumentVisible';
export * from './isOnline';

export { fullscreen }

export type RefTyped<T> = T | Ref<T>;
export type Fn = (...args: any) => any;
export type Obj<T> = { [key: string]: T };