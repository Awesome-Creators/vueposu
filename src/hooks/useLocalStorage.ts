export interface useLocalStorageOptions<T> {
  key: string;
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
export default function useLocalStorage() {}