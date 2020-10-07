import { shallowRef, unref } from 'vue-demi';
import useRequest from '../useRequest';
import isDocumentVisible from '../../libs/isDocumentVisible';
import type { SWRConfig } from './types';

// slow connection (<= 70Kbps)
const slowConnection =
  typeof window !== 'undefined' &&
  navigator['connection'] &&
  ['slow-2g', '2g'].indexOf(navigator['connection'].effectiveType) !== -1;

// config
const config = shallowRef<SWRConfig>({
  onLoadingSlow: () => {},
  onSuccess: () => {},
  onError: () => {},
  onErrorRetry: (_, __, config, revalidate, options) => {
    if (!isDocumentVisible()) {
      return;
    }

    const errorRetryCount = unref(config.errorRetryCount) || 0;
    const retryCount = unref(options.retryCount);
    if (
      typeof errorRetryCount === 'number' &&
      retryCount > unref(config.errorRetryCount)
    ) {
      return;
    }

    const count = Math.min(retryCount || 0, 8);
    const timeout =
      ~~((Math.random() + 0.5) * (1 << count)) *
      unref(config.errorRetryInterval);
    setTimeout(revalidate, timeout, options);
  },

  errorRetryInterval: (slowConnection ? 10 : 5) * 1000,
  focusThrottleInterval: 5000,
  dedupingInterval: 2000,
  loadingTimeout: (slowConnection ? 5 : 3) * 1000,

  refreshInterval: 0,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,

  fetcher: useRequest,
});

// config provider
const useSWRGlobalConfig = (overridedConfig: SWRConfig) => {
  config.value = {
    ...config.value,
    ...overridedConfig,
  };
};

export { useSWRGlobalConfig };
export default config;
