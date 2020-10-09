import { computed } from 'vue-demi';
import useSWR from './useSWR';

// https://github.com/antfu/vueuse/blob/master/packages/core/useStorage/index.ts
const Serializers = {
  boolean: {
    read: (v: any, d: any) => (v != null ? v === 'true' : d),
    write: (v: any) => String(v),
  },
  object: {
    read: (v: any, d: any) => (v ? JSON.parse(v) : d),
    write: (v: any) => JSON.stringify(v),
  },
  number: {
    read: (v: any, d: any) => (v != null ? Number.parseFloat(v) : d),
    write: (v: any) => String(v),
  },
  any: {
    read: (v: any, d: any) => v ?? d,
    write: (v: any) => String(v),
  },
  string: {
    read: (v: any, d: any) => v ?? d,
    write: (v: any) => String(v),
  },
};

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const type = $value =>
    $value == null
      ? 'any'
      : typeof $value === 'boolean'
      ? 'boolean'
      : typeof $value === 'string'
      ? 'string'
      : typeof $value === 'object'
      ? 'object'
      : Array.isArray($value)
      ? 'object'
      : !Number.isNaN($value)
      ? 'number'
      : 'any';

  const update = value => {
    value === null
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, Serializers[type(value)].write(value));
    return value;
  };

  // useSWR(key, () => {
  //   console.log('test');
  //   return update('1');
  // });

  const { data, mutate } = useSWR(key, () => {
    console.log('vvv');
    console.log(key);
    const value = Serializers[type(defaultValue)].read(
      localStorage.getItem(key),
      defaultValue,
    );
    return update(value);
  });

  const state = computed({
    get: () => data.value,
    set: value => mutate(update(value)),
  });

  return state;
}
