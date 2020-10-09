export interface useSessionStorageOptions<T> {
  value: T;
  defaultValue: T;
}

export type useSessionStorageActions<T> = [
  T,
  {
    set: () => void;
    reset: () => void;
    remove: () => void;
  },
];

// WIP
export default function useSessionStorage<T>(
  key: string,
  options: useSessionStorageOptions<T>,
) {}
