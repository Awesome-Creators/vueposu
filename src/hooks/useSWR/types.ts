export type Fetcher<Data> = (...args: any) => Data | Promise<Data>;

export interface ConfigInterface<
  Data = any,
  Error = any,
  Fn extends Fetcher<Data> = Fetcher<Data>
> {
  errorRetryInterval?: number;
  errorRetryCount?: number;
  loadingTimeout?: number;
  focusThrottleInterval?: number;
  dedupingInterval?: number;
  refreshInterval?: number;
  refreshWhenHidden?: boolean;
  refreshWhenOffline?: boolean;
  revalidateOnFocus?: boolean;
  revalidateOnMount?: boolean;
  revalidateOnReconnect?: boolean;
  shouldRetryOnError?: boolean;
  fetcher?: Fn;
  suspense?: boolean;
  initialData?: Data;

  onLoadingSlow?: (key: string, config: ConfigInterface<Data, Error>) => void;
  onSuccess?: (
    data: Data,
    key: string,
    config: ConfigInterface<Data, Error>,
  ) => void;
  onError?: (
    err: Error,
    key: string,
    config: ConfigInterface<Data, Error>,
  ) => void;
  onErrorRetry?: (
    err: Error,
    key: string,
    config: ConfigInterface<Data, Error>,
    revalidate: RevalidateType,
    revalidateOpts: RevalidateOptionInterface,
  ) => void;

  compare?: (a: Data | undefined, b: Data | undefined) => boolean;
}

export interface RevalidateOptionInterface {
  retryCount?: number;
  dedupe?: boolean;
}

export type KeyType = string | any[] | null;

type KeyFunction = () => KeyType;

export type KeyInterface = KeyFunction | KeyType;

export type UpdaterInterface<Data = any, Error = any> = (
  shouldRevalidate?: boolean,
  data?: Data,
  error?: Error,
  shouldDedupe?: boolean,
) => boolean | Promise<boolean>;

export type triggerInterface = (
  key: KeyInterface,
  shouldRevalidate?: boolean,
) => Promise<any>;

export type mutateCallback<Data = any> = (
  currentValue: Data,
) => Promise<Data> | Data;

export type mutateInterface<Data = any> = (
  key: KeyInterface,
  data?: Data | Promise<Data> | mutateCallback<Data>,
  shouldRevalidate?: boolean,
) => Promise<Data | undefined>;

export type ActionType<Data, Error> = {
  data?: Data;
  error?: Error;
  isValidating?: boolean;
};

export type RevalidateType = (
  revalidateOpts: RevalidateOptionInterface,
) => Promise<boolean>;

export interface CacheInterface {
  get(key: KeyInterface): any;
  set(key: KeyInterface, value: any): any;
  keys(): string[];
  has(key: KeyInterface): boolean;
  delete(key: KeyInterface): void;
  clear(): void;
  serializeKey(key: KeyInterface): [string, any, string];
  subscribe(listener: CacheListener): () => void;
}

export type CacheListener = () => void;
