/* istanbul ignore file */
export type Fetcher<D> = (...args: any) => D | Promise<D>;

export interface ConfigInterface<
  D = any,
  E = any,
  F extends Fetcher<D> = Fetcher<D>
> {
  loadingTimeout?: number;
  dedupingInterval?: number;

  onLoadingSlow?: (key: string, config: ConfigInterface<D, E>) => void;
  onSuccess?: (data: D, key: string, config: ConfigInterface<D, E>) => void;
  onError?: (err: Error, key: string, config: ConfigInterface<D, E>) => void;
  
  shouldRetryOnError?: boolean;
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

export type BroadcastStateInterface<D = any, E = any> = (
  key: string,
  data: D,
  error?: E,
  isValidating?: boolean,
) => void;

export type CacheListener = () => void;
