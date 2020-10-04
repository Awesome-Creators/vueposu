/* istanbul ignore file */
import { shallowRef } from 'vue-demi';
import useRequest from '../useRequest';
import { SWRConfig } from './types';

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

  focusThrottleInterval: 5000,
  dedupingInterval: 2000,
  loadingTimeout: (slowConnection ? 5 : 3) * 1000,

  refreshInterval: 0,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  revalidateOnFocus: true,
  revalidateOnReconnect: true,

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
