import { useStorage } from 'vueposu';

export function useLocalStorage<T>(key: string, defaultValue?: T) {
  return useStorage(key, defaultValue);
}
