export interface useLocalStorageOptions<T> {
  value: T;
  defaultValue: T;
}

export type useLocalStorageActions<T> = [
  T,
  {
    set: () => void;
    reset: () => void;
    remove: () => void;
  },
];

// WIP
export default function useLocalStorage<T>(
  key: string,
  options: useLocalStorageOptions<T>,
) {}
