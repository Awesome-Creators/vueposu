import { shallowReactive } from 'vue';
import { ConfigInterface } from './types';

const SWRConfigContext = shallowReactive<ConfigInterface>({});

export default SWRConfigContext;
