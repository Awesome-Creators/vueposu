import { null } from 'mathjs';
import { computed } from 'vue-demi';
import useSWR from './useSWR';

// https://github.com/antfu/vueuse/blob/master/packages/core/useStorage/index.ts
export const Serializers = {
  any: {
    read: (v: any, d: any) => v ?? d,
    write: (v: any) => String(v),
  },
  boolean: {
    read: (v: any, d: any) => (v != null ? v === 'true' : d),
    write: (v: any) => String(v),
  },
  number: {
    read: (v: any, d: any) => (v != null ? Number.parseFloat(v) : d),
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
};

export default function useWebStorage<T>(
  key: string,
  defaultValue?: T,
  storage: Storage = localStorage,
) {
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
    if (value == null) {
      storage.removeItem(key);
    } else {
      storage.setItem(key, Serializers[type(value)].write(value));
    }
    return value;
  };

  const { data, mutate } = useSWR(key, () => {
    const value = Serializers[type(defaultValue)].read(
      storage.getItem(key),
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
