/* istanbul ignore file */
import { shallowRef } from 'vue-demi';
// import { isEqual } from '../../libs/helper';
import { ConfigInterface } from './types';
import Cache from './cache';

// cache
const cache = new Cache();

// config
const config = shallowRef<ConfigInterface>({
  fetcher: url => fetch(url).then(res => res.json()),
  initialData: 
});

// config provider
const useSWRGlobalConfig = (overridedConfig: ConfigInterface) => {
  config.value = {
    ...config.value,
    ...overridedConfig,
  };
};

export { cache, useSWRGlobalConfig };
export default config;
