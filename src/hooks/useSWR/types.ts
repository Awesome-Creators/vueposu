/* istanbul ignore file */
export type Fetcher<Data> = (...args: any) => Data | Promise<Data>;

export interface ConfigInterface<
  D = any,
  E = any,
  F extends Fetcher<D> = Fetcher<D>
> {
  fetcher?: F;
  initialData?: D;
}

export type KeyType = string | any[] | null;

type KeyFunction = () => KeyType;

export type KeyInterface = KeyFunction | KeyType;

export type ActionType<D, E> = {
  data?: D;
  error?: E;
  isValidating?: boolean;
};

export type UseSWRReturnType<D, E> = ActionType<D, E> & {
  isValidating: boolean;
};

export interface CacheInterface {
  get(key: KeyInterface): any;
  set(key: KeyInterface, value: any): any;
  keys(): string[];
  has(key: KeyInterface): boolean;
  delete(key: KeyInterface): void;
  clear(): void;
  serializeKey(key: KeyInterface): [string, any, string, string];
  subscribe(listener: CacheListener): () => void;
}

export type CacheListener = () => void;
