import { getCurrentInstance } from 'vue-demi';
import { useStorage } from 'vueposu';

export function useSessionStorage<T>(key: string, defaultValue?: T) {
  if (getCurrentInstance()) {
    return useStorage(key, defaultValue, window?.sessionStorage);
  } else {
    throw new Error(
      'Invalid hook call: `useSessionStorage` can only be called inside of `setup()`.',
    );
  }
}
