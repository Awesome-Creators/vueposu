/* istanbul ignore file */
import { shallowReactive } from 'vue-demi';
import { ConfigInterface } from './types';

const SWRConfigContext = shallowReactive<ConfigInterface>({});

export default SWRConfigContext;
