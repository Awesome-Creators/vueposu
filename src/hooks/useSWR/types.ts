import type { Ref } from 'vue-demi';
import type { RefTyped } from '../../types/global';

/* istanbul ignore file */
export type Fetcher<D> = (...args: any) => D | Promise<D>;

export interface SWRConfig<
  D = any,
  E = any,
  F extends Fetcher<D> = Fetcher<D>
> {
  loadingTimeout?: RefTyped<number>;
  focusThrottleInterval?: RefTyped<number>;
  dedupingInterval?: RefTyped<number>;
  refreshInterval?: RefTyped<number>;
  refreshWhenHidden?: RefTyped<boolean>;
  refreshWhenOffline?: RefTyped<boolean>;
  revalidateOnFocus?: RefTyped<boolean>;
  revalidateOnMount?: RefTyped<boolean>;
  revalidateOnReconnect?: RefTyped<boolean>;
  shouldRetryOnError?: RefTyped<boolean>;
  fetcher?: F;
  initialData?: D;

  onLoadingSlow?: (key: string, config: SWRConfig<D, E>) => void;
  onSuccess?: (data: D, key: string, config: SWRConfig<D, E>) => void;
  onError?: (err: E, key: string, config: SWRConfig<D, E>) => void;
  onErrorRetry?: (
    err: E,
    key: string,
    config: SWRConfig<D, E>,
    revalidate: (options: RevalidateOptions) => Promise<boolean>,
    options: RevalidateOptions,
  ) => void;
}

export type KeyType = string | any[] | null;

type KeyFunction = () => KeyType;

export type SWRKey = KeyFunction | KeyType;

export type MutateCallback<D = any> = (currentValue: D) => Promise<D> | D;

export interface RevalidateOptions {
  retryCount?: number;
  dedupe?: boolean;
}

export type UseSWRReturnType<D, E> = {
  data: Ref<D>;
  error: Ref<E>;
  isValidating: Ref<boolean>;
  revalidate: () => Promise<boolean>;
  mutate: (
    data?: D | Promise<D> | MutateCallback<D>,
    shouldRevalidate?: boolean,
  ) => Promise<D | undefined>;
};

export type BroadcastState<D = any, E = any> = (
  key: string,
  data: D,
  error?: E,
  isValidating?: boolean,
) => void;

export type CacheListener = () => void;
