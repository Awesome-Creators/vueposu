import { shallowRef, unref } from 'vue-demi';
import { isDocumentVisible } from '@vueposu/utils';

import type { SWRConfig } from './types';

// slow connection (<= 70Kbps)
const slowConnection =
  typeof window !== 'undefined' &&
  navigator['connection'] &&
  ['slow-2g', '2g'].indexOf((navigator['connection'] as any)?.["effectiveType"]) !== -1;

const errorRetryInterval = (slowConnection ? 10 : 5) * 1000;

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
    const retryCount = unref(options.retryCount) || 0;
    if (
      typeof errorRetryCount === 'number' &&
      retryCount > errorRetryCount
    ) {
      return;
    }

    const count = Math.min(retryCount || 0, 8);
    const timeout =
      ~~((Math.random() + 0.5) * (1 << count)) *
      (unref(config.errorRetryInterval) || errorRetryInterval);
    setTimeout(revalidate, timeout, options);
  },

  errorRetryInterval,
  focusThrottleInterval: 5000,
  dedupingInterval: 2000,
  loadingTimeout: (slowConnection ? 5 : 3) * 1000,
  refreshInterval: 0,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  suspense: false,
  fetcher: (url: string, init?: RequestInit) =>
    fetch(url, init).then(res => res.json()),
});

// config provider
export const useSWRGlobalConfig = (overridedConfig: SWRConfig) => {
  config.value = {
    ...config.value,
    ...overridedConfig,
  };
};
export default config;
