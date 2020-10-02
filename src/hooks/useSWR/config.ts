/* istanbul ignore file */
import { shallowRef } from 'vue-demi';
import useRequest from '../useRequest';
import { ConfigInterface } from './types';

// slow connection (<= 70Kbps)
const slowConnection =
  typeof window !== 'undefined' &&
  navigator['connection'] &&
  ['slow-2g', '2g'].indexOf(navigator['connection'].effectiveType) !== -1;

// config
const config = shallowRef<ConfigInterface>({
  onLoadingSlow: () => {},
  onSuccess: () => {},
  onError: () => {},

  dedupingInterval: 2000,
  loadingTimeout: (slowConnection ? 5 : 3) * 1000,

  fetcher: useRequest,
});

// config provider
const useSWRGlobalConfig = (overridedConfig: ConfigInterface) => {
  config.value = {
    ...config.value,
    ...overridedConfig,
  };
};

export { useSWRGlobalConfig };
export default config;
