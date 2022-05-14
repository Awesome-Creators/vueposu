import { useStorage } from 'vueposu';

export function useSessionStorage<T>(key: string, defaultValue?: T) {
  return useStorage(key, defaultValue, window?.sessionStorage);
}
