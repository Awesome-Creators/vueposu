// https://github.com/antfu/vueuse/blob/master/packages/core/useStorage/index.ts

import { isDef, isUndefined, isObject, isArray } from '../../libs/helper';

const type = value =>
  value === null
    ? 'null'
    : typeof value === 'boolean'
    ? 'boolean'
    : typeof value === 'string' || isUndefined(value)
    ? 'string'
    : isObject(value) || isArray(value)
    ? 'object'
    : !Number.isNaN(value)
    ? 'number'
    : 'any';

export const Serializers = {
  any: {
    read: (v: any, d: any) => v ?? d,
    write: (v: any) => String(v),
  },
  boolean: {
    read: (v: any, d: any) => (isDef(v) ? v === 'true' : d),
    write: (v: any) => String(v),
  },
  number: {
    read: (v: any, d: any) => (isDef(v) ? Number.parseFloat(v) : d),
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any, d: any) => (v ? JSON.parse(v) : d),
    write: (v: any) => JSON.stringify(v),
  },
  string: {
    read: (v: any, d: any) => v ?? d,
    write: (v: any) => String(v),
  },
  null: {
    read: () => null,
    write: () => null,
  },
};

export const read = (value, defaultValue) =>
  Serializers[type(defaultValue)].read(value, defaultValue);

export const write = value => Serializers[type(value)].write(value);
