// https://github.com/antfu/vueuse/blob/master/packages/core/useStorage/index.ts

import { isDef, isUndef, isUndefined, isObject, isArray } from "@vueposu/utils";

const getType = (value: any) =>
  value === null
    ? "null"
    : typeof value === "boolean"
    ? "boolean"
    : typeof value === "string" || isUndefined(value)
    ? "string"
    : isObject(value) || isArray(value)
    ? "object"
    : !Number.isNaN(value)
    ? "number"
    : "any";

export const Serializers = {
  any: {
    read: (v: any, d: any) => v ?? d,
    write: (v: any) => String(v),
  },
  boolean: {
    read: (v: any, d: any) => (isDef(v) ? v === "true" : d),
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
    read: (v: any, d: any) => (isDef(v) ? v : d),
    write: (v: any) => String(v),
  },
  null: {
    read: () => null,
    write: () => "null",
  },
};

export const read = (value: any, defaultValue: any) => {
  let type: keyof typeof Serializers;
  const $value = isUndef(value) ? defaultValue : value;
  try {
    type = getType(JSON.parse($value));
  } catch (err) {
    type = getType($value);
  }
  return Serializers[type].read(value, defaultValue);
};

export const write = (value: any) => Serializers[getType(value)].write(value);
