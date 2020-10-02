export interface useCookieOptions<T> {
  key: string;
  value: T;
  defaultValue: T;
  expires: string;
  path: string;
  domain: string;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}

export type useCookieActions<T> = [
  T,
  {
    set: () => void;
    reset: () => void;
    remove: () => void;
  },
];
